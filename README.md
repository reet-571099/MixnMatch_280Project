# 🍳 MixnMatch - AI-Powered Recipe & Meal Planning

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Supabase](https://img.shields.io/badge/Supabase-2.79.0-3ECF8E?style=flat-square&logo=supabase)
![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Transform your kitchen with AI-powered recipes and personalized meal planning**


---

###  **Screenshots**

**Homepage**

<img width="1469" height="815" alt="Screenshot 2025-12-11 at 12 36 42 AM" src="https://github.com/user-attachments/assets/b04b8bcc-4a82-49ee-b447-1a828db16271" />

**AI Chat**: Interactive recipe generation interface

<img width="1470" height="792" alt="Screenshot 2025-12-11 at 12 38 20 AM" src="https://github.com/user-attachments/assets/b1cffb44-30b2-4080-b74b-d59aeff92106" />
  
**Meal Planner**: Weekly meal planning with drag-and-drop

  <img width="1468" height="822" alt="Screenshot 2025-12-11 at 12 40 06 AM" src="https://github.com/user-attachments/assets/0048ac76-544e-4852-ae84-ac6d53dc6ed6" />
  
**Recipe Cards**: Beautiful recipe displays with ratings and reviews

  <img width="1468" height="823" alt="Screenshot 2025-12-11 at 12 40 49 AM" src="https://github.com/user-attachments/assets/d528e89c-e0db-4a29-b83e-f9f4a625431c" />

**Mobile View**: Fully responsive design for all devices

<img width="393" height="781" alt="Screenshot 2025-12-11 at 12 41 24 AM" src="https://github.com/user-attachments/assets/4f9cea12-6945-413f-a767-2c1e7b28bec3" />

---

</div>

##  Features

### AI-Powered Cooking Assistant
- **Smart Recipe Generation**: Create recipes from ingredients you have or dietary preferences
- **Intelligent Chat Interface**: Natural language conversation with your personal chef AI
- **Recipe Suggestions**: Get personalized recommendations based on your taste profile
- **Ingredient Substitutions**: Smart swaps for dietary restrictions and preferences

### Intelligent Meal Planning
- **7-Day Meal Plans**: AI-generated weekly meal plans tailored to your needs
- **Macro Constraints**: Set protein, carb, fat, and calorie targets
- **Dietary Preferences**: Vegan, gluten-free, keto, paleo, and more
- **Download Plans**: Export meal plans as text files for offline use

### Recipe Management
- **Recipe Discovery**: Browse through 20,000+ curated recipes
- **Save Favorites**: Bookmark your favorite recipes for quick access
- **Recipe Details**: Step-by-step instructions, ingredients, and nutritional info
- **Rating System**: Rate and review recipes to improve recommendations
- **Personal Collection**: Build your own recipe library

### Modern UI/UX
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful transitions powered by Framer Motion
- **Intuitive Navigation**: Clean, modern interface with excellent UX

### Secure Authentication
- **Google OAuth**: Quick and secure login with Google accounts
- **JWT Tokens**: Secure session management
- **User Profiles**: Personalized experience with user accounts
- **Privacy Focused**: Your data stays yours

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Radix UI + MaterialUI
- **Animations**: Framer Motion
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express
- **AI/ML**: LangChain + Google Gemini 2.5 + Cohere Embeddings
- **Database**: Supabase (PostgreSQL + Vector Storage + MongoDB)
- **Authentication**: Passport.js + JWT + Google OAuth
- **GraphQL**: Apollo Server for user data
- **RAG System**: Vector embeddings for semantic recipe search

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Git** for version control
- **Google Cloud** account (for AI APIs)
- **Supabase** account (for database)
- **Cohere** account (for embeddings)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mixnmatch.git
   cd mixnmatch
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd MixnMatch_Frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../MixnMatch_Backend
   npm install
   ```

4. **Install Auth Server Dependencies**
   ```bash
   cd ../Oauth
   npm install
   ```

5. **Environment Setup**

   Create `.env` files in each backend directory:

   **MixnMatch_Backend/.env**:
   ```env
   GOOGLE_API_KEY=your_google_ai_api_key
   COHERE_API_KEY=your_cohere_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   PORT=3001
   ```

   **Oauth/.env**:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   ```

6. **Start the Development Servers**

   **Terminal 1 - Frontend**:
   ```bash
   cd MixnMatch_Frontend
   npm run dev
   ```

   **Terminal 2 - Backend API**:
   ```bash
   cd MixnMatch_Backend
   node server.js
   ```

   **Terminal 3 - Auth Server**:
   ```bash
   cd Oauth
   npm start
   ```

7. **Access the Application**

   Open (http://localhost:8080) in your browser

## Performance

- **Lighthouse Score**: 80+ on all metrics (to be edited)
- **Core Web Vitals**: All green scores
- **Bundle Size**: <200KB gzipped
- **First Paint**: <1.5 seconds
- **Time to Interactive**: <2 seconds

## Metrics
- HomePage

<img width="551" height="126" alt="Screenshot 2025-12-11 at 2 32 56 PM" src="https://github.com/user-attachments/assets/5c0655c2-b025-4f7d-b5f5-84f13e81128a" />

- Explore

<img width="549" height="126" alt="Screenshot 2025-12-11 at 2 32 35 PM" src="https://github.com/user-attachments/assets/447f72de-bf36-416f-a767-2228acd5d908" />

- Create Recipe

<img width="568" height="129" alt="Screenshot 2025-12-11 at 2 33 10 PM" src="https://github.com/user-attachments/assets/bcb40afe-2598-49b8-bd83-3a5a09583f1d" />

- Meal Planner

<img width="566" height="132" alt="Screenshot 2025-12-11 at 2 33 28 PM" src="https://github.com/user-attachments/assets/fc08f127-e953-43f2-b7f4-b793129cc2f9" />


## AI Tool Usage Disclosure

This project leverages AI tools to enhance development efficiency and code quality:

### Cursor IDE
- **Bug Detection**: Automated error identification and fixes
- **Refactoring**: Intelligent code restructuring suggestions
- **Documentation**: AI-generated code comments and documentation

### GitHub Copilot
- **Styling Improvements**: Enhanced CSS/TailwindCSS class suggestions
- **Error Handling**: Improved error boundary implementations
- **Performance Optimization**: Code optimization recommendations
- **Testing**: Test case generation and assertion suggestions

### Development Philosophy
While AI tools significantly accelerated development and improved code quality, all AI-generated code was reviewed, tested, and modified by human developers to ensure:
- Code correctness and reliability
- Security best practices
- Performance optimization
- Maintainability and readability

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

⭐ Star this repo if you find it helpful!

</div>
