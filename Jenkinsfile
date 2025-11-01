pipeline {
  agent any

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
