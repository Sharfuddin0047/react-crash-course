# 🚀 Jenkins + Docker CI/CD Setup

This project demonstrates a **simple CI/CD pipeline** where **Jenkins** automates the deployment process and **Docker** containerizes the application.  
The pipeline builds a Docker image and runs a container on **port 80**, enabling fast and consistent deployments.

---

# 📊 Architecture Overview

**Flow:**  
Developer → Git Repository → Jenkins Pipeline → Docker Build → Docker Container → Live Application

---

# 📌 Prerequisites

Ensure the following requirements are met before starting:

- Linux Machine (**Ubuntu 22.04 or 24.04 recommended**)
- Sudo privileges
- Stable internet connection
- Firewall / Security Group inbound rules:
  - **Port 8080** → Jenkins
  - **Port 80** → Application

---

# ⚙️ Step 1 – Install Jenkins

Jenkins requires **Java Runtime Environment (JRE)** to function.

## Update System Packages

```bash
sudo apt update
````

## Install Java

```bash
sudo apt install fontconfig openjdk-21-jre
java -version
```

## Add Jenkins Repository and Key

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
```

## Install Jenkins

```bash
sudo apt update
sudo apt install jenkins -y
```

## Start and Enable Jenkins

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

## Verify Status

```bash
sudo systemctl status jenkins
```

---

## 🔐 Access Jenkins

Open your browser:

```
http://<your-server-ip>:8080
```

Retrieve the initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

# 🐳 Step 2 – Install Docker

## Install Docker

```bash
sudo apt install docker.io -y
```

## Start and Enable Docker

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## Verify Installation

```bash
docker --version
```

---

# 👥 Step 3 – Add Users to Docker Group

By default, the **jenkins user cannot access Docker**.
Adding it to the Docker group allows execution without `sudo`.

```bash
# Add Jenkins and current user
sudo usermod -aG docker jenkins
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Restart Jenkins
sudo systemctl restart jenkins
```

---

# 🧾 Step 4 – Create Jenkins Pipeline

Create a file named **`Jenkinsfile`** in your project root directory.

```groovy
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
```

---

# ▶️ Step 5 – Run the Pipeline

1. Open **Jenkins Dashboard**
2. Click **New Item**
3. Enter a project name
4. Select **Pipeline**
5. Under Pipeline:

   * Choose **Pipeline script from SCM** (recommended for GitHub),
     **OR**
   * Paste the script directly
6. Click **Save**
7. Select **Build Now**

---

# 🌐 Verify Deployment

After a successful build, open:

```
http://<your-server-ip>
```

Your application should now be running inside a Docker container 🎉

---

# ✅ Outcome

✔ Automated CI/CD — Build and deployment triggered via Jenkins
✔ Containerization — Application runs in an isolated Docker environment
✔ Improved Security — Jenkins executes Docker without root login
✔ High Accessibility — App available on standard HTTP port **80**

---

# ⭐ Support

If you found this project helpful, consider **giving it a star ⭐** on GitHub!



