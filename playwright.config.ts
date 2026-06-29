import { defineConfig, devices } from '@playwright/test';



export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: process.env.CI ? 2 : 6,
  timeout: 60000,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'yes' }],['allure-playwright']
  ],

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
        
  },

  projects: [

    { name: 'authsetup',
      testMatch: /.loginauth/

    },


    {
      name: 'lambdatest-chrome',
      dependencies: ['authsetup'],

      use: {
        ...devices['Desktop Chrome'],
      storageState: 'auth/auth.json'
    }
       
    }
    
  ]
  
});
