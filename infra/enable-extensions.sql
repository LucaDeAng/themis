-- Enable pgvector extension for semantic search and embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions are enabled
SELECT extname, extversion 
FROM pg_extension 
WHERE extname IN ('vector', 'uuid-ossp');
