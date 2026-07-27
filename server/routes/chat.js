const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { ANTHROPIC_API_KEY, ANTHROPIC_CHAT_MODEL } = require('../config');

const router = express.Router();
router.use(authRequired);

const client = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

const HISTORY_LIMIT = 20; // how many prior turns to send back as context

function buildSystemPrompt(user) {
  const statusLine = user.pregnancy_status === 'pregnant' && user.pregnancy_start_date
    ? 'They are currently pregnant.'
    : user.pregnancy_status === 'trying'
      ? 'They are currently trying to conceive.'
      : 'They are tracking their menstrual cycle and are not currently pregnant.';

  return [
    "You are a warm, knowledgeable companion inside a women's health and pregnancy tracking app. " +
    'You have two jobs: answering questions about menstrual cycles, pregnancy, symptoms, and general ' +
    'wellness, and simply being someone to talk to when the user wants to vent, process how they are ' +
    'feeling, or just chat. Keep replies conversational and reasonably brief unless they ask for detail.',

    `The user you're talking to is named ${user.name}. ${statusLine}`,

    'Safety boundaries: you are not a doctor. Do not diagnose conditions, interpret test or lab results, ' +
    'or recommend specific medications or dosages. For anything that sounds like it may need medical ' +
    'attention (heavy bleeding, severe or worsening pain, signs of a pregnancy complication, decreased ' +
    'fetal movement, or similar), say so plainly and encourage them to contact their doctor or emergency ' +
    'services rather than relying solely on your answer. If they seem to be in real emotional distress, ' +
    'lead with warmth and care, and you can mention that Postpartum Support International ' +
    '(1-800-944-4773) offers free support - without being pushy about it.'
  ].join('\n\n');
}

router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC'
  ).all(req.userId);
  res.json(rows.map(r => ({ id: r.id, role: r.role, content: r.content, createdAt: r.created_at })));
});

router.post('/', async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: 'AI chat is not configured. Set ANTHROPIC_API_KEY on the server (see server/.env.example).' });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

  const priorRows = db.prepare(
    'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(req.userId, HISTORY_LIMIT);
  const priorMessages = priorRows.reverse().map(r => ({ role: r.role, content: r.content }));

  const userRow = db.prepare('INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)')
    .run(req.userId, 'user', message);
  const userMessage = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(userRow.lastInsertRowid);

  try {
    const response = await client.messages.create({
      model: ANTHROPIC_CHAT_MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(user),
      output_config: { effort: 'medium' },
      messages: [...priorMessages, { role: 'user', content: message }]
    });

    let replyText;
    if (response.stop_reason === 'refusal') {
      replyText = "I'm not able to help with that particular message. If it's something medical or urgent, please reach out to your doctor or emergency services.";
    } else {
      const textBlock = response.content.find(b => b.type === 'text');
      replyText = textBlock ? textBlock.text : "Sorry, I didn't quite catch that - could you try rephrasing?";
    }

    const assistantRow = db.prepare('INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)')
      .run(req.userId, 'assistant', replyText);
    const assistantMessage = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(assistantRow.lastInsertRowid);

    res.status(201).json({
      userMessage: { id: userMessage.id, role: 'user', content: userMessage.content, createdAt: userMessage.created_at },
      assistantMessage: { id: assistantMessage.id, role: 'assistant', content: assistantMessage.content, createdAt: assistantMessage.created_at }
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(502).json({ error: 'Could not reach the AI assistant. Please try again in a moment.' });
  }
});

router.delete('/', (req, res) => {
  db.prepare('DELETE FROM chat_messages WHERE user_id = ?').run(req.userId);
  res.status(204).end();
});

module.exports = router;
