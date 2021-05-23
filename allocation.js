function checkUserLogin() {
    if (!sessionStorage.getItem('userData') || !JSON.parse(sessionStorage.getItem('userData')).role_id) {
        window.location.href = './login.html'
    }
    console.log(JSON.parse(sessionStorage.getItem('userData')).role_id);
}

function logout() {
    sessionStorage.clear()
    window.location.href = './login.html'
}

const getEducatorsDD = (rawData) => {
    let tempArr = []
    const convertToInt = (number) => parseInt(number || 0)
    for (index in rawData['educatorsId']) {
        rawData['educatorsId'][index] && tempArr.push({
            employeeId: rawData['educatorsId'][index],
            employeeName: rawData['educatorsName'][index],
            feedback: rawData['educatorsFeedback'][index],
            experience: rawData['educatorsExperience'][index],
            score: (0.6 * convertToInt(rawData['educatorsFeedback'][index])) + (0.4 * convertToInt(rawData['educatorsExperience'][index]))
        })
    }
    let sortedArr = tempArr.sort((a, b) => b.score - a.score)

    const getOptions = (rawArr = []) => {
        let opt = '<option disabled selected>Select Educator</option>'
        for (i in rawArr.slice(0, 3)) {
            opt += `<option>${rawArr[i]['employeeName']}</option>`
        }
        return opt
    }

    return `<div class="form-group">
    <select class="form-control" id="${rawData['courseId']}_ed">
      ${getOptions(sortedArr)}
    </select>
  </div>`
}

const getTADD = (rawData, batchSize) => {
    if (batchSize <= 50) {
        return `Not Required`
    }
    let tempArr = []
    const convertToInt = (number) => parseInt(number || 0)
    for (index in rawData['TAsId']) {
        rawData['TAsId'][index] && tempArr.push({
            employeeId: rawData['TAsId'][index],
            employeeName: rawData['TAsName'][index],
            feedback: rawData['TAsFeedback'][index],
            experience: rawData['TAsExperience'][index],
            score: (0.6 * convertToInt(rawData['TAsFeedback'][index])) + (0.4 * convertToInt(rawData['TAsExperience'][index]))
        })
    }
    let sortedArr = tempArr.sort((a, b) => b.score - a.score)

    const getOptions = (rawArr = []) => {
        let opt = '<option disabled selected>Select TA</option>'
        for (i in rawArr.slice(0, 3)) {
            opt += `<option>${rawArr[i]['employeeName']}</option>`
        }
        return opt
    }

    return `<div class="form-group">
    <select class="form-control" id="${rawData['courseId']}_ed">
      ${getOptions(sortedArr)}
    </select>
  </div>`
}

function makeBatchDeailsCall(streamId, batchSize) {
    var data = JSON.stringify({
        streamId
    })

    var req = new XMLHttpRequest();
    req.open('POST', "http://localhost:4000/streamData");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);
    req.onload = () => {
        var streamResponse = JSON.parse(req.responseText)
        if (req.status === 200) {
            sessionStorage.setItem('streamData', JSON.stringify(streamResponse))
            var allCourseData = JSON.parse(sessionStorage.getItem('streamData'))
            if (allCourseData) {
                let AllCourseTableBody = document.getElementById('display_all_course_data_table_body')
                AllCourseTableBody.innerHTML = ''
                let courseData = allCourseData['streamData']
                for (index in courseData) {
                    AllCourseTableBody.innerHTML += `
                <tr id='row_data_${index}'>
                <td id='row_data_${index}_courseId'>${courseData[index]['courseId']}</td>
                <td id='row_data_${index}_courseName'>${courseData[index]['courseName']}</td>
                <td id='row_data_${index}_startDate'>${new Date(courseData[index]['startDate']).toLocaleDateString()}</td>
                <td id='row_data_${index}_endDate'>${new Date(courseData[index]['endDate']).toLocaleDateString()}</td>
                <td id='row_data_${index}_ed'>${getEducatorsDD(courseData[index])}</td>
                <td id='row_data_${index}_ta'>${getTADD(courseData[index], batchSize)}</td>
                </tr>
                `
                }
                document.getElementById('display_all_course_data').classList.remove('d-none')
                document.getElementById('display_all_course_data').scrollIntoView();
            }
        } else if (req.status === 400) {
            alert(streamResponse.errorMessage)
            sessionStorage.setItem('streamData', false)
        } else {
            alert("Internal server Error")
            sessionStorage.setItem('streamData', false)
        }
        return true;
    }

}