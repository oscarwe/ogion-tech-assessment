import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y .env en tu entorno de prueba
  dir: './',
})

// Configuración personalizada de Jest
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Maneja el alias @/
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)