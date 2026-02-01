pipeline{
    agent any
    
    environment {
        DOCKER_USER = 'sharfuddin47'
        IMAGE_NAME = 'spa'
        BUILD_TAG   = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Clean'){
            steps{
               cleanWs()
            }
        }
        stage('Code Checkout'){
            steps{
                echo "this is cloning the code"
                git url: "https://github.com/Sharfuddin0047/react-crash-course.git", branch: "master"
            }
        }
        stage("Image Build") {
            steps{
                echo "this is building the code"
                sh '''
                    docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_TAG} .
                    '''
            }
        }
        stage("Docker push and Deploy") {
            parallel {
                stage("Docker login") {
                    steps {
                        withCredentials([usernamePassword(credentialsId: 'dockerPAT', 
                                                 usernameVariable: 'DOCKER_USERNAME', 
                                                 passwordVariable: 'DOCKER_PASS')]){
                                                     sh '''
                                                        echo $DOCKER_PASS | docker login -u $DOCKER_USERNAME --password-stdin
                                                        echo "docker login successful"
                                                        docker push ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_TAG}
                                                        docker tag ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_TAG} ${DOCKER_USER}/${IMAGE_NAME}:latest
                                                        docker push ${DOCKER_USER}/${IMAGE_NAME}:latest
                                                        '''
                                                 }
                    }
                }
                stage("Deploy") {
                    steps {
                        sh '''
                            docker rm -f ${IMAGE_NAME} || echo "No old container"      
                            docker run -d --name ${IMAGE_NAME} -p 80:80 ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_TAG}
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Good job pipeline succeded'
        }
        failure {
            error 'Pipeline failed, check the logs'
        }

    }
}