pipeline {
  agent any

  environment {
    NAME = "highway-animation"
    VERSION = "${env.BUILD_ID}-${env.GIT_COMMIT}"
    IMAGE_REPO = "siddharth67"
    GITEA_TOKEN = credentials('gitea-token')
  }
  
  stages {
    stage('Unit Tests') {
      steps {
        echo 'Implement unit tests if applicable.'
        echo 'This stage is a sample placeholder'
      }
    }

    stage('Build Image') {
      steps {
            sh "docker build -t ${NAME} ."
            sh "docker tag ${NAME}:latest ${IMAGE_REPO}/${NAME}:${VERSION}"
        }
      }

    stage('Push Image') {
      steps {
        withDockerRegistry([credentialsId: "docker-hub", url: ""]) {
          sh 'docker push ${IMAGE_REPO}/${NAME}:${VERSION}'
        }
      }
    }

    stage('Clone/Pull Repo') {
      steps {
        script {
          if (fileExists('cgoa-demos')) {

            echo 'Cloned repo already exists - Pulling latest changes'

            dir("cgoa-demos") {
              sh 'git pull'
            }

          } else {
            echo 'Repo does not exists - Cloning the repo'
            sh 'git clone -b feature-gitea https://3000-port-ot7bvscbcueb36tz.kodekloud.com/kk-org/cgoa-demos.git'
          }
        }
      }
    }
    
    stage('Update Manifest') {
      steps {
        dir("cgoa-demos/jenkins-demo") {
          script {
              sh "sed -i \"s#\\(image:\\s*\\).*#\\1${IMAGE_REPO}/${NAME}:${VERSION}#g\" deployment.yml"
              sh "cat deployment.yml"
          }
        }
      }
    }

    stage('Commit & Push') {
      steps {
        dir("cgoa-demos/jenkins-demo") {
          sh "git config --global user.email 'jenkins@ci.com'"
          sh 'git remote set-url origin https://$GITEA_TOKEN@3000-port-ot7bvscbcueb36tz.kodekloud.com/kk-org/cgoa-demos.git'
          sh 'git checkout feature-gitea'
          sh 'git add -A'
          sh 'git commit -am "Updated image version for Build - $VERSION"'
          sh 'git push origin feature-gitea'
        }
      }
    }

    stage('Raise Gitea PR') {
      steps {
        sh "bash gitea-pr.sh"
      }
    } 
  }
}