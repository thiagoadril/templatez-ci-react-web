def DOCKER_TOOL_NAME
def BASE_BOLDER_NAME
def APP_PROJECT_NAME
def APP_IMAGE_NAME
def APP_NETWORK_NAME

pipeline {
    agent any

    stages { 
		stage('INIT') {
            steps{
                script {
					DOCKER_TOOL_NAME="Default"
                    BASE_BOLDER_NAME="app"
					APP_PROJECT_NAME="templatez_app_frontend"
					APP_IMAGE_NAME="company_templatez_frontend"
					APP_NETWORK_NAME="company_templatez_network_frontend"
                }
            }                
        }

		/*
		 *	[CLEAN - (START)]
		 */
		stage('CLEAN - (START)') {
			steps {
				echo "-----------------------------------"
				echo 'Initial cleaning running....'
				script {
					fileOperations([folderDeleteOperation("${BASE_BOLDER_NAME}/ci")])
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
					docker.withTool(DOCKER_TOOL_NAME) {
						def image = docker.image('node:12.16.1')
						image.pull()
						image.inside() {
							switch(env.BRANCH_NAME) {
								case "master":
								sh "cd ${BASE_BOLDER_NAME} && yarn install && yarn build:production"
								break
								case "staging":
								sh "cd ${BASE_BOLDER_NAME} && yarn install && yarn build:staging"
								break
								case "testing":
								sh "cd ${BASE_BOLDER_NAME} && yarn install && yarn build:testing"
								break
								case "develop":
								sh "cd ${BASE_BOLDER_NAME} && yarn install && yarn build"
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
					fileOperations([folderCopyOperation(destinationFolderPath: "${BASE_BOLDER_NAME}/ci/image/build", sourceFolderPath: "${BASE_BOLDER_NAME}/build/")])
					fileOperations([folderCopyOperation(destinationFolderPath: "${BASE_BOLDER_NAME}/ci/image/deploy", sourceFolderPath: "${BASE_BOLDER_NAME}/tools/deploy/")])
					fileOperations([fileCopyOperation(excludes: '', flattenFiles: true, includes: "${BASE_BOLDER_NAME}/Dockerfile*", targetLocation: "${BASE_BOLDER_NAME}/ci/image")])
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
						docker.withTool(DOCKER_TOOL_NAME) {
							def baseimage = docker.image('node:12.16.1')
							baseimage.pull()
							def image = docker.build("${APP_IMAGE_NAME}_${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}:${env.BUILD_ID}","${BASE_BOLDER_NAME}/ci/image/")
							image.tag("latest");
						}
					} else {
						docker.withTool(DOCKER_TOOL_NAME) {
							def baseimage = docker.image('node:12.16.1')
							baseimage.pull()
							def image = docker.build("${APP_IMAGE_NAME}_${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}","${BASE_BOLDER_NAME}/ci/image/")
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
					docker.withTool(DOCKER_TOOL_NAME) {
						
						def imagesuffix  = "${env.BRANCH_NAME.replace('feature/','').replace('release/','').toLowerCase()}"
						def image = docker.image('docker/compose:1.23.2')
						image.pull()
						
						withDockerContainer(args: '--entrypoint=\'\'', image: 'docker/compose:1.23.2', toolName: DOCKER_TOOL_NAME) {
							withEnv(["IMAGE_SUFFIX=${imagesuffix}"]) {
								switch(env.BRANCH_NAME) {
								  case "master":
								  	sh "docker network ls|grep ${APP_NETWORK_NAME}_production > /dev/null || docker network create --driver bridge ${APP_NETWORK_NAME}_production"
									sh "cp docker/env/docker-env-production.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-production.yaml --project-name ${APP_PROJECT_NAME}_${imagesuffix} up -d"
									break
								  case "staging":
									sh "docker network ls|grep ${APP_NETWORK_NAME}_staging > /dev/null || docker network create --driver bridge ${APP_NETWORK_NAME}_staging"
									sh "cp docker/env/docker-env-staging.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-staging.yaml --project-name ${APP_PROJECT_NAME}_staging up -d"
									break
								  case "testing":
									sh "docker network ls|grep ${APP_NETWORK_NAME}_testing > /dev/null || docker network create --driver bridge ${APP_NETWORK_NAME}_testing"
									sh "cp docker/env/docker-env-testing.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-testing.yaml --project-name ${APP_PROJECT_NAME}_testing up -d"
									break
								  case "develop":
									sh "docker network ls|grep ${APP_NETWORK_NAME}_development > /dev/null || docker network create --driver bridge ${APP_NETWORK_NAME}_development"
									sh "cp docker/env/docker-env-development.env .env"
									sh "docker-compose -f docker/compose/docker-compose.yaml -f docker/compose/docker-compose-development.yaml --project-name ${APP_PROJECT_NAME}_development up -d"
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
					fileOperations([folderDeleteOperation("${BASE_BOLDER_NAME}/ci")])
				}
				echo '-----------------------------------'
			}
		}		
    }
}