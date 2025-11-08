import 'dotenv/config';
import { LLMService, InitiativeGenerator, createDefaultRegistry } from '@themis/core';

/**
 * Test script to verify Gen AI layer is working
 * Run with: npx tsx test-gen-ai.ts
 */

async function testLLMService() {
  console.log('🧪 Testing LLM Service...\n');

  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: No API key found!');
    console.log('Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment');
    console.log('Example: $env:OPENAI_API_KEY="sk-..."');
    return;
  }

  const provider = process.env.LLM_PROVIDER || 'openai';
  const model = process.env.LLM_MODEL || 'gpt-4-turbo-preview';

  console.log(`Provider: ${provider}`);
  console.log(`Model: ${model}\n`);

  // Initialize LLM service
  const llmService = new LLMService(
    {
      provider: provider as 'openai' | 'anthropic' | 'ollama',
      model,
      apiKey,
      temperature: 0.7,
    },
    (metrics) => {
      console.log(`📊 Usage: ${metrics.totalTokens} tokens in ${metrics.durationMs}ms`);
    }
  );

  try {
    // Test 1: Simple completion
    console.log('Test 1: Simple Completion');
    console.log('─'.repeat(50));
    
    const response = await llmService.complete({
      messages: [
        { role: 'user', content: 'Say hello and introduce yourself in one sentence!' }
      ],
      maxTokens: 100,
    });

    console.log(`Response: ${response.content}`);
    console.log(`✅ Completion test passed!\n`);

    // Test 2: Initiative Generation
    console.log('Test 2: Initiative Generation');
    console.log('─'.repeat(50));

    const registry = createDefaultRegistry();
    const generator = new InitiativeGenerator(llmService, registry);

    const initiatives = await generator.generate({
      projectId: 'test-123',
      intent: 'Build a mobile fitness app that helps users track workouts and nutrition',
      criteria: [
        { name: 'User Impact', description: 'Value delivered to end users' },
        { name: 'Technical Feasibility', description: 'Ease of implementation' },
      ],
      count: 3,
      diversity: 0.8,
    });

    console.log(`\n✅ Generated ${initiatives.length} initiatives:\n`);
    
    initiatives.forEach((init, idx) => {
      console.log(`${idx + 1}. ${init.title}`);
      console.log(`   Impact: ${init.estimatedImpact}/5`);
      console.log(`   Confidence: ${(init.confidence * 100).toFixed(0)}%`);
      console.log(`   Description: ${init.description.substring(0, 100)}...`);
      console.log(`   Tags: ${init.tags.join(', ')}\n`);
    });

    console.log('✅ All tests passed! Gen AI layer is working correctly! 🎉');

  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your API key is valid');
    console.log('2. Verify you have API credits');
    console.log('3. Check your internet connection');
    console.log('4. Try with a different provider');
  }
}

// Run tests
testLLMService().catch(console.error);
