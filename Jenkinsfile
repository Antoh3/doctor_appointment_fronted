pipeline {
  agent any

  environment {
        NODE_ENV = 'production'
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

    stage('Deploy to Vercel') {
        steps {
            echo 'Deploying to Vercel...'
            sh 'vercel deploy --prod --token=$VERCEL_TOKEN --yes'
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
