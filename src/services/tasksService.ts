import tasks from '@/mocks/tasks.json'

export const getTasks = () => {

    const response = {
        status: 200,
        data: []
    }

    tasks.tasks.forEach((task: any) => {
        if(task.userId === 1){
            response.data.push(task)
        }
    })


    return response
}