def PROJECT_NAME
def IMAGE_NAME
def NETWORK_NAME
def APP_FOLDER_NAME

pipeline {
    agent any

    stages { 
		stage('INIT') {
            steps{
                script{
					PROJECT_NAME="template_app_frontend"
					IMAGE_NAME="company_template_frontend"
					NETWORK_NAME="company_network_frontend"
                    APP_FOLDER_NAME="app"
                }
            }                
        }

		/*
		 *	[CLEAN - (START)]
		 */
		stage('CLEAR (START)CLEAN - (START)') {
			steps {
				echo "-----------------------------------"
				echo 'Initial cleaning running....'
				script {
					//Aplicacões
					fileOperations([folderDeleteOperation("${APP_FOLDER_NAME}/ci")])
				}
				echo '-----------------------------------'
			}
		}
				
		/*
		 *	[BUILD]
		 */
        stage('BUILD') {
            steps {
				echo '-----------------------------------'
				echo 'Generating build...'
				script {
					docker.withTool("Default") {
						def image = docker.image('node:12.16.1')
						image.pull()
						image.inside() {
							switch(env.BRANCH_NAME) {
								case "master":
								sh 'cd app && yarn install && yarn build:production'
								break
								case "staging":
								sh 'cd app && yarn install && yarn build:staging'
								break
								case "testing":
								sh 'cd app && yarn install && yarn build:testing'
								break
								case "develop":
								sh 'cd app && yarn install && yarn build'
								break;
							}
						}
					}
				}
				echo '-----------------------------------'
            }
        }

		/*
		 *	[IO (FILES)]
		 */
		stage('IO (FILES)') {
		    steps  {
				echo '-----------------------------------'
				echo 'IO starting...'
				script {
					//Aplicações
					fileOperations([folderCopyOperation(destinationFolderPath: "${APP_FOLDER_NAME}/ci/image/build", sourceFolderPath: "${APP_FOLDER_NAME}/build/")])
					fileOperations([folderCopyOperation(destinationFolderPath: "${APP_FOLDER_NAME}/ci/image/deploy", sourceFolderPath: "${APP_FOLDER_NAME}/tools/deploy/")])
					fileOperations([fileCopyOperation(excludes: '', flattenFiles: true, includes: "${APP_FOLDER_NAME}/Dockerfile*", targetLocation: "${APP_FOLDER_NAME}/ci/image")])
				}
				echo '-----------------------------------'
			}
        }
		
		/*
		 *	[IMAGES]
		 */
        stage('IMAGES') {
            steps {
				echo '-----------------------------------'
				echo 'Generating app image...'
				script {
					if(env.BRANCH_NAME.contains('master')) {
						docker.withTool('Default') {
							def baseimage = docker.image('node:12.16.1')
							baseimage.pull()
							def image = docker.build("${IMAGE_NAME}_${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}:${env.BUILD_ID}","${APP_FOLDER_NAME}/ci/image/")
							image.tag("latest");
						}
					} else {
						docker.withTool('Default') {
							def baseimage = docker.image('node:12.16.1')
							baseimage.pull()
							def image = docker.build("${IMAGE_NAME}_${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}","${APP_FOLDER_NAME}/ci/image/")
							image.tag("latest");
						}
					}
				}
				echo '-----------------------------------'
            }
        }
		
		/*
		 *	[ENVIRONMENT]
		 */
		stage('ENVIRONMENT') {
			steps {
				echo '-----------------------------------'
				echo 'Configure application environment...'
				script {
					docker.withTool('Default') {
						
						def imagesuffix  = "${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}"
						def image = docker.image('docker/compose:1.23.2')
						image.pull()
						
						withDockerContainer(args: '--entrypoint=\'\'', image: 'docker/compose:1.23.2', toolName: 'Default') {
							withEnv(["IMAGE_SUFFIX=${imagesuffix}"]) {
								switch(env.BRANCH_NAME) {
								  case "master":
								  	sh "docker network ls|grep ${NETWORK_NAME}_production > /dev/null || docker network create --driver bridge ${NETWORK_NAME}_production"
									sh "cp docker/env/docker-env-production.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-production.yaml --project-name ${PROJECT_NAME}_${imagesuffix} up -d"
									break
								  case "staging":
									sh "docker network ls|grep ${NETWORK_NAME}_staging > /dev/null || docker network create --driver bridge ${NETWORK_NAME}_staging"
									sh "cp docker/env/docker-env-staging.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-staging.yaml --project-name ${PROJECT_NAME}_staging up -d"
									break
								  case "testing":
									sh "docker network ls|grep ${NETWORK_NAME}_testing > /dev/null || docker network create --driver bridge ${NETWORK_NAME}_testing"
									sh "cp docker/env/docker-env-testing.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-testing.yaml --project-name ${PROJECT_NAME}_testing up -d"
									break
								  case "develop":
									sh "docker network ls|grep ${NETWORK_NAME}_development > /dev/null || docker network create --driver bridge ${NETWORK_NAME}_development"
									sh "cp docker/env/docker-env-development.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-development.yaml --project-name ${PROJECT_NAME}_development up -d"
									break;
								}
							}
						}
					}
				}
				echo '-----------------------------------'
			}
		}
		
		/*
		 *	[CLEAN (END)]
		 */
		stage('CLEAN (END)') {
			steps {
				echo '-----------------------------------'
				echo 'End cleaning running....'
				script {
					fileOperations([folderDeleteOperation("${APP_FOLDER_NAME}/ci")])
				}
				echo '-----------------------------------'
			}
		}		
    }
}