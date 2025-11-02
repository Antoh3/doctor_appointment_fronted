pipeline {
  agent any

  environment {
        VERCEL_TOKEN = credentials('VERCEL_TOKEN')
    }


  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive build artifacts') {
      steps {
        archiveArtifacts artifacts: '.next/**', fingerprint: true
      }
    }

    stage('Confirm Deploy to staging') {
       steps {
         timeout(time: 60, unit: 'SECONDS') {
           input(message: 'Okay to Deploy?', ok: 'Let\'s Do it!')
         }
       }
     }

    stage('Deploy to Vercel') {
        steps {
            echo 'Deploying to Vercel...'
            sh 'npx vercel deploy --prod --token=$VERCEL_TOKEN --yes'
        }
    }
  }

  post {
    success {
      echo 'Build completed successfully!'
    }
    failure {
      echo ' Build failed!'
    }
  }
}

