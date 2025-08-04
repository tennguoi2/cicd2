pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_BACKEND = 'tennguoi2/cicd-nodejs-mysql-backend'
        DOCKER_IMAGE_FRONTEND = 'tennguoi2/cicd-nodejs-mysql-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        
        
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build backend image
                    def backendImage = docker.build("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}", "-f backend/Dockerfile .")
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        backendImage.push()
                        backendImage.push("latest")
                    }
                    
                    // Build frontend image
                    def frontendImage = docker.build("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}", "-f Dockerfile .")
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        frontendImage.push()
                        frontendImage.push("latest")
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker-compose down
                    docker-compose pull
                    docker-compose up -d
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 10
                    curl --fail http://localhost:3001/health || exit 1
                    curl --fail http://localhost:3001/metrics || exit 1
                    curl --fail http://localhost:9090/api/v1/targets | grep -q '"health":"up"'
                    curl --fail http://localhost:3000/api/v1/datasources | grep -q '"name":"Prometheus"'
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded! Application and monitoring are up.'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
    }
}