
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, type = 'general' } = await req.json();

    let systemPrompt = '';
    switch (type) {
      case 'test':
        systemPrompt = 'You are an educational AI tutor that creates quick tests and quizzes. Create a short quiz (3-5 questions) based on the topic the user mentions. Format your response with clear questions and multiple choice options where appropriate.';
        break;
      case 'doubt':
        systemPrompt = 'You are an educational AI tutor that specializes in clarifying doubts and explaining complex concepts in simple terms. Break down the concept step by step and provide clear examples.';
        break;
      case 'study':
        systemPrompt = 'You are an educational AI tutor that provides study tips, learning strategies, and academic guidance. Give practical and actionable advice.';
        break;
      default:
        systemPrompt = 'You are EduFocus AI, an educational assistant that helps students with their studies. You can solve problems, answer questions, create tests, and provide study guidance. Keep responses concise but helpful.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
