# Themis Project Structure

## Overview
This document provides a comprehensive guide to the Themis project architecture and Gen AI implementation.

## Gen AI Layer Architecture

### Core Components

#### 1. LLM Service (`packages/core/src/llm/`)
- **Provider Abstraction**: Unified interface supporting OpenAI, Anthropic, and Ollama
- **Rate Limiting**: Token bucket algorithm preventing API throttling
- **Budget Guards**: Per-workspace and global token budget enforcement
- **Retry Logic**: Exponential backoff for transient failures
- **Usage Tracking**: Comprehensive metrics collection

#### 2. Prompt Registry (`packages/core/src/llm/prompt-registry.ts`)
- **Versioned Templates**: All prompts tracked with semantic versioning
- **Variable Injection**: Type-safe template variable substitution
- **Evaluation Harness**: Built-in testing framework for prompt quality
- **Centralized Management**: Single source of truth for all LLM interactions

#### 3. Embedding Service (`packages/core/src/llm/embedding-service.ts`)
- **Vector Generation**: Text-to-vector conversion using provider embeddings
- **Similarity Search**: Cosine similarity computation
- **Duplicate Detection**: Automatic identification of similar initiatives
- **pgvector Integration**: Native PostgreSQL vector search

#### 4. Generation Services (`packages/core/src/generation/`)

##### Initiative Generator
- **Guided Ideation**: Generate initiatives from goals and criteria
- **Diversity Control**: Temperature-based variety in suggestions
- **Quality Filtering**: Impact and confidence thresholds
- **Batch Processing**: Efficient generation of large initiative sets

##### Brief Generator
- **Section-by-Section**: Regenerate individual brief components
- **Executive Summary**: Concise 2-3 sentence overviews
- **Risk Analysis**: Identify risks with mitigation strategies
- **Success Metrics**: Measurable KPIs for tracking
- **Image Prompts**: DALL-E/Midjourney-optimized descriptions

##### Enrichment Service
- **Context Enhancement**: Expand initiative descriptions
- **Tag Generation**: Automatic categorization
- **Risk Identification**: AI-powered risk assessment
- **Related Concepts**: Discover similar or complementary ideas

### Prompt Templates

All prompts are defined in `packages/core/src/llm/prompt-registry.ts`:

1. **intent_capture** - Convert free text to structured objectives
2. **initiative_generation** - Generate ideas from goals/criteria
3. **brief_generation** - Create comprehensive concept briefs
4. **enrichment** - Enhance initiative details
5. **similarity_check** - Detect duplicate initiatives

### Rate Limiting & Budget Control

#### Rate Limiter
```typescript
- Requests per minute: Configurable limit
- Tokens per minute: Prevents quota exhaustion
- Token bucket algorithm: Smooth request distribution
```

#### Budget Guard
```typescript
- Daily global budget: Total token allocation
- Workspace budget: Per-workspace limits
- Usage tracking: 30-day rolling window
- Real-time enforcement: Pre-request budget checks
```

### Provider Configuration

#### OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4-turbo-preview
```

#### Anthropic
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-3-opus-20240229
```

#### Ollama (Local)
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3:latest
```

### Usage Example

```typescript
import {
  LLMService,
  InitiativeGenerator,
  BriefGenerator,
  createDefaultRegistry,
} from '@themis/core';

// Initialize LLM service
const llmService = new LLMService(
  {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: 2000,
  },
  async (metrics) => {
    console.log('Token usage:', metrics.totalTokens);
  }
);

// Initialize generators
const promptRegistry = createDefaultRegistry();
const initiativeGen = new InitiativeGenerator(llmService, promptRegistry);
const briefGen = new BriefGenerator(llmService, promptRegistry);

// Generate initiatives
const initiatives = await initiativeGen.generate({
  projectId: 'proj_123',
  intent: 'Launch a mobile app for fitness tracking',
  criteria: [
    { name: 'User Impact', description: 'Value delivered to users' },
    { name: 'Feasibility', description: 'Technical implementation ease' },
  ],
  count: 10,
  diversity: 0.8,
});

// Generate brief
const brief = await briefGen.generate({
  initiativeId: 'init_456',
  title: initiatives[0].title,
  description: initiatives[0].description,
  scores: { 'User Impact': 4.5, 'Feasibility': 3.8 },
  criteria: [
    { name: 'User Impact', weight: 0.6 },
    { name: 'Feasibility', weight: 0.4 },
  ],
  sections: ['executive_summary', 'rationale', 'risks', 'metrics', 'image_prompt'],
});
```

## Database Schema

### Key Tables for Gen AI Features

#### initiatives
```sql
- embedding: vector(1536) -- pgvector for similarity search
- source: manual | csv | llm_generated | enriched
- metadata: jsonb -- Additional LLM-generated context
```

#### briefs
```sql
- executive_summary: text
- rationale: text
- risks: text
- metrics: text
- image_prompt: text
- sections: jsonb -- Structured brief data
```

#### activity_logs
```sql
- action: text -- Track LLM operations
- payload: jsonb -- Include token usage, prompts used
```

## Development Workflow

### 1. Setup
```bash
make setup
```

### 2. Development
```bash
make dev
```

### 3. Testing Gen AI Features
```bash
# Unit tests for LLM services
pnpm --filter @themis/core test

# Test prompt templates
pnpm --filter @themis/core test prompt-registry

# Integration tests
pnpm --filter @themis/api test generation
```

### 4. Monitoring
- Token usage dashboard (planned)
- Budget alerts (planned)
- Prompt performance metrics (planned)

## Security Considerations

1. **API Key Management**: Environment variables only, never committed
2. **Budget Enforcement**: Hard limits prevent runaway costs
3. **Input Sanitization**: Prevent prompt injection
4. **Output Validation**: Zod schemas for all LLM responses
5. **Audit Logging**: All LLM calls tracked in activity_logs

## Performance Optimization

1. **Caching**: Repeated requests cached in-memory (Redis in production)
2. **Batch Processing**: Parallel generation for multiple initiatives
3. **Streaming**: Support for streaming responses (future)
4. **Token Estimation**: Pre-request token counting
5. **Provider Failover**: Automatic fallback to backup providers (planned)

## Future Enhancements

1. **Fine-tuning**: Custom models for domain-specific tasks
2. **RAG Integration**: Retrieval-augmented generation for context
3. **Multi-modal**: Image analysis for initiative validation
4. **Real-time Collaboration**: Streaming LLM responses to frontend
5. **A/B Testing**: Prompt template experiments
6. **Cost Optimization**: Dynamic provider selection based on cost/quality

## Cost Management

### Estimated Costs (OpenAI GPT-4 Turbo)
- Initiative generation (10 ideas): ~$0.05-0.10
- Brief generation: ~$0.02-0.05
- Enrichment: ~$0.01-0.03
- Embeddings: ~$0.0001 per initiative

### Budget Recommendations
- Small team (<10 users): $50/month
- Medium team (10-50 users): $200/month
- Large team (50+ users): $500+/month

## Troubleshooting

### Rate Limit Errors
```typescript
// Increase rate limits in .env
LLM_RATE_LIMIT_PER_MINUTE=100
```

### Token Budget Exceeded
```typescript
// Check usage
const usage = await budgetGuard.getUsage('workspace_id', 'daily');
const remaining = budgetGuard.getRemainingBudget('workspace_id');
```

### Provider Errors
```typescript
// Check health
const healthy = await llmService.healthCheck();
```

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [Ollama Documentation](https://ollama.ai)
- [pgvector](https://github.com/pgvector/pgvector)
