import projects from '@/mocks/projects.json'

export const getProjects = () => {
    const response = {
        status: 200,
        data: []
    }

    projects.projects.forEach((project: any) => {
        if(project.userId === 1){
            response.data.push(project)
        }
    })

    return response
}