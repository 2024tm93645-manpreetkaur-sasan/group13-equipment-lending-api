## Backend Branching Strategy 

GitHub Repo - https://github.com/2024tm93645-manpreetkaur-sasan/group13-equipment-lending-api


                ┌─────────────────────────┐
                │        MAIN             │
                │  Stable, reviewed code  │
                └──────────┬──────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
┌──────────────────────┐          ┌──────────────────────┐
│      MANUAL          │          │    AI-ASSISTED       │
│  Traditional dev code  │        | AI-generated code    │
 
└──────────┬───────────┘          └──────────┬───────────┘
│                                 │
└──────────────┬──────────────────┘
               │
┌────────────────────┐
│   MERGE & REVIEW   │
│ Compare, test, and │
│  integrate to main │
└────────────────────┘
