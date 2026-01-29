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

        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building Frontend...'
                    // Run build in a Node container
                    // We use an anonymous volume for node_modules here as well for clean build
                    sh '''
                        docker run --rm \
                        -v "$PWD/frontend":/app \
                        -v /app/node_modules \
                        -w /app \
                        node:20 \
                        sh -c "npm install && npm run build"
                    '''
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
