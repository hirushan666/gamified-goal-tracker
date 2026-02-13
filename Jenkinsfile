pipeline {
    agent any

    environment {
        APP_SERVER_IP = '16.171.19.133'  
        DOCKER_USER   = 'hirushanww'
        BACKEND_IMAGE = 'gamified-goal-tracker-backend'
        FRONTEND_IMAGE= 'gamified-goal-tracker-frontend'
        IMAGE_TAG     = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Environment') {
            steps {
                sh 'docker-compose -f docker-compose.test.yml down -v --remove-orphans || true'
            }
        }

        stage('Test Backend') {
            steps {
                script {
                    echo 'Starting MongoDB and running Backend Tests...'
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
                        
                        // Build
                        sh "docker build -t ${DOCKER_USER}/${BACKEND_IMAGE}:latest ./backend"
                        sh "docker build -t ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} ./backend"
                        
                        // Push
                        sh "docker push ${DOCKER_USER}/${BACKEND_IMAGE}:latest"
                        sh "docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        // Build
                        def backendUrl = "http://${APP_SERVER_IP}:3000"

                        // 2. Build with the argument
                        sh "docker build --build-arg REACT_APP_API_URL=${backendUrl} -t ${DOCKER_USER}/${FRONTEND_IMAGE}:latest ./frontend"
                        sh "docker build --build-arg REACT_APP_API_URL=${backendUrl} -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend"
                                
                        // Push
                        sh "docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:latest"
                        sh "docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['prod-ssh-key']) { // <--- Uses the SSH key credential
                    script {
                        def dockerRunBackend = """
                            docker run -d \\
                            --name backend \\
                            --network goal-tracker-net \\
                            -p 3000:5000 \\
                            -e MONGO_URI='mongodb://mongo:27017/goaltracker' \\
                            -e JWT_SECRET='mySuperSecretKey123' \\    
                            ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        """
                        // ^ Note: You might need a real MongoDB URL here if not using a containerized DB on prod

                        def dockerRunFrontend = """
                            docker run -d \\
                            --name frontend \\
                            --network goal-tracker-net \\
                            -p 80:80 \\
                            ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                        """

                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} '
                                echo "🚀 Starting Deployment on Production Server..."
                                
                                # 1. Pull new images
                                docker pull ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                                docker pull ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}

                                # 2. Stop & Remove Old Containers
                                docker stop backend frontend || true
                                docker rm backend frontend || true

                                # 3. Run Backend
                                ${dockerRunBackend}

                                # 4. Run Frontend
                                ${dockerRunFrontend}
                                
                                # 5. Cleanup unused images (Optional space saving)
                                docker image prune -f
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker-compose -f docker-compose.test.yml down -v --remove-orphans || true'
        }
    }
}