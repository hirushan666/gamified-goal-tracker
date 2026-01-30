pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Environment') {
            steps {
                // Ensure no conflicting containers are running and clean up old test volumes
                sh 'docker-compose -f docker-compose.test.yml down -v --remove-orphans || true'
            }
        }

        stage('Test Backend') {
            steps {
                script {
                    echo 'Starting MongoDB and running Backend Tests...'
                    // We run npm install && npm test inside the container
                    // The volume /app/node_modules prevents polluting the host with Linux binaries
                    sh 'docker-compose -f docker-compose.test.yml run --rm backend-test'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    echo 'Running Frontend Tests...'
                    sh 'docker-compose -f docker-compose.test.yml run --rm frontend-test'
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        
                        // Build Backend
                        sh 'docker build -t hirushanww/gamified-goal-tracker-backend:latest ./backend'
                        sh "docker build -t hirushanww/gamified-goal-tracker-backend:${BUILD_NUMBER} ./backend"
                        
                        // Push Backend
                        sh 'docker push hirushanww/gamified-goal-tracker-backend:latest'
                        sh "docker push hirushanww/gamified-goal-tracker-backend:${BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        // Build Frontend
                        sh 'docker build -t hirushanww/gamified-goal-tracker-frontend:latest ./frontend'
                        sh "docker build -t hirushanww/gamified-goal-tracker-frontend:${BUILD_NUMBER} ./frontend"
                        
                        // Push Frontend
                        sh 'docker push hirushanww/gamified-goal-tracker-frontend:latest'
                        sh "docker push hirushanww/gamified-goal-tracker-frontend:${BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Teardown test environment
            sh 'docker-compose -f docker-compose.test.yml down -v --remove-orphans || true'
        }
    }
}
