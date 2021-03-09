const autoTeam = (data) => {
  const sortArr = [];
  const team = {};
  const duo = {};
  const madeTeam = [];
  const assignedArr = []
  const remainArr = Object.keys(data);

  const isFav = (name, favorite) => {
    if (!data[name] || !data[favorite]) return false;
    if (name === '' || favorite === '') return false;
    if (data[name].Favorite.includes(favorite)) return true;
    else return false;
  }; //name이 favorite을 선호하는지
  const isCross = (name, favorite) => {
    if (!data[name] || !data[favorite]) return false;
    if (name === '' || favorite === '') return false;
    else if (isFav(name, favorite) && isFav(favorite, name)) return true;
    else return false;
  }; //name < -> favorite 서로 선호하는지
  const isDiff = (name, difficult) => {
    if (!data[name] || !data[difficult]) return false;
    if (name === '' || difficult === '') return false;
    if (
      data[name].Difficult.includes(difficult) ||
      data[difficult].Difficult.includes(name)
    )
      return true;
    else return false;
  }; //name이 difficult를 비선호 하는지
  const isTeamFav = (arr,name) => {//arr === team[i]
    let teamFavArr = []
    for(let i = 0; i < arr.length; i += 1){
      teamFavArr.push(...data[arr[i]].Favorite)
    }
    teamFavArr = Array.from(new Set(teamFavArr))
    for(let i = 0; i < teamFavArr.length; i += 1){
      if(teamFavArr[i] === ''){
        teamFavArr.splice(i,1)
      }
    }
    
    if(teamFavArr.includes(name)){
      return true
    }
    return false
    
  } //arr팀이 선호하는 사람들 중에 name이 있는지
  const isTeamDiff = (arr, name) => {
    let check = false;
    for (let i = 0; i < arr.length; i += 1) {
      if (isDiff(arr[i], name)) {
        check = true;
      }
    }
    return check;
  }; //arr팀에서 비선호 하는 사람이 있는지

  
  
  const makePoint = (name) => {
    let point = 0;
    for (let key in data) {
      if (data[key].Favorite.includes(name)) {
        point++;
      }
      if(data[key].Difficult.includes(name)) {
        point --;
      }
    }
    
    sortArr.push([name, point]);
    return point
  };
  const makeSortArr = () => {
    for(let i = 0; i < remainArr.length; i += 1){
      makePoint(remainArr[i])
    }
    sortArr.sort((a,b) => b[1]-a[1])
  }
  const makeTeamPoint = (arr) => {
    let teamPoint = 0
    for(let i = 0; i < arr.length; i += 1){
      teamPoint = teamPoint + makePoint(arr[i]) 
    }
    return teamPoint
  }
  const makeFitTeam = () => {
    const tempObj = {} //중복 배열을 거르기 위해 필요한 객체
    const removeRepeat = (value) => {
      for(let key in team){
        return !team[key].includes(value)
      }
    }
    for(let key in data){
      if(isCross(key,data[key].Favorite[0]) && isCross(key,data[key].Favorite[1]) && isCross(data[key].Favorite[1],data[key].Favorite[0])){
        madeTeam.push([key,data[key].Favorite[0],data[key].Favorite[1]].sort())
      }
      else if(isCross(key,data[key].Favorite[0]) && isCross(key,data[key].Favorite[2]) && isCross(data[key].Favorite[2],data[key].Favorite[0])){
        madeTeam.push([key,data[key].Favorite[0],data[key].Favorite[2]].sort())
      }
      else if(isCross(key,data[key].Favorite[1]) && isCross(key,data[key].Favorite[2]) && isCross(data[key].Favorite[2],data[key].Favorite[1])){
        madeTeam.push([key,data[key].Favorite[1],data[key].Favorite[2]].sort())
      }
      
    } //세명이 서로 짝대기가 맞을 경우를 체크하는 반복문
    
    for(let i = 0; i < madeTeam.length; i += 1){
      if(!tempObj[madeTeam[i]]){
        tempObj[madeTeam[i]] = 1
      }
      else{
        tempObj[madeTeam[i]] ++
      }
    } // 쓸모없는 데이터를 찾기 위한 반복문
    for(let key in tempObj){
      if(tempObj[key] === 1 || tempObj[key] === 2){
        delete tempObj[key]
      }
    } // 쓸모없는 데이터 삭제
    for(let i = 0; i < Object.keys(tempObj).length; i += 1){
      team[i+1] = Object.keys(tempObj)[i].split(',')
    } //짝대기가 맞는 세명을 우선적으로 팀 배치
    for(let i = remainArr.length -1; i >=0; i --){
      for(let key in team){
        if(team[key].includes(remainArr[i])){
          assignedArr.push(remainArr[i])
          remainArr.splice(i,1)
        }
      }
    } //이미 배정된 사람은 remain arr에서 삭제
    for(let i = remainArr.length-1; i >= 0; i --){
      for(let key in team){
        if(isCross(remainArr[i],team[key][0]) || isCross(remainArr[i],team[key][1]) || isCross(remainArr[i],team[key][2])){
          if(isFav(team[key][0],remainArr[i]) && isFav(team[key][1],remainArr[i]) && isFav(team[key][2],remainArr[i])){
            team[key].push(remainArr[i])
            assignedArr.push(remainArr[i])
            remainArr.splice(i,1)
          }
        }
      }
    } //변절자 없는 네명 팀 만들기
    
  
    
    
  }
  const makeTeam = () => {
    // 1. 팀이 선호하는 사람
    // 2. 본인이 선호하는 사람
    // 3. 그냥 꽂기
    makeFitTeam()
    makeSortArr()
    
    const peopleNum = Object.keys(data).length
    if(peopleNum % 4 === 0){
      console.log(`총 인원 : ${peopleNum}, 4명 팀 : ${parseInt(peopleNum / 4)}, 3명 팀 : 0`)
      const assignedNum = Object.keys(team).length
      const copySort = sortArr.map((ele)=>ele[0])//sortArr copy
      for(let i = Object.keys(team).length; i < peopleNum /4; i += 1){
        team[i + 1] = []
      }//팀 만들기
      for(let i = 0; i < copySort.length; i += 1){
        const currentStudent = sortArr[0][0]
        let [cross ,teamFav, myFav, teamDiff] = new Array(4).fill(false)
        let makeHead = 0
        let crossTeam = 0
        let favTeam = 0
        for(let j = Math.max(...Object.keys(team)); j >= 1; j --){
          if(isCross(currentStudent,team[j][0]) || isCross(currentStudent,team[j][1]) || isCross(currentStudent,team[j][2]) ){
            if(team[j].length < 4){
               cross = true
              crossTeam = j
            }
          } // 현재수강생이 선호하는 사람이 팀에 있고 현재수강생을 선호할 경우
          else if(isTeamFav(team[j],currentStudent)){
            if(team[j].length < 4){
              favTeam = j
            teamFav = true
            }
          } //팀내에 현재수강생을 선호하는 사람이 있을 경우
          else if(team[j].includes(data[currentStudent].Favorite[0]) || team[j].includes(data[currentStudent].Favorite[1]) || team[j].includes(data[currentStudent].Favorite[2])){
            if(team[j].length < 4){
              favTeam = j
            myFav = true
            }
           
          } //현재 수강생이 선호하는 사람이 팀에 있을 경우
          else if(team[j].length === 0){
            makeHead = j
          }
        } // 팀을 순회해서 적합한 팀을 선택
        if(cross && !isTeamDiff(team[crossTeam],currentStudent)){ 
          team[crossTeam].push(currentStudent)
          assignedArr.push(currentStudent)
          
        }
        else if(teamFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else if(myFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else{
          if(makeHead !== 0){
            team[makeHead].push(currentStudent) 
            assignedArr.push(currentStudent)
          }
          else{
            for(let key in team){
              if(team[key].length < 4 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                team[key].push(currentStudent)
                assignedArr.push(currentStudent)
              }
            }
          }
        }
        sortArr.shift()
        
      }
    }
    else if(peopleNum % 4 === 1){
      console.log(`총 인원 : ${peopleNum}, 4명 팀 : ${parseInt((peopleNum - 9) / 4)}, 3명 팀 : 3`)
      const assignedNum = Object.keys(team).length
      const copySort = sortArr.map((ele)=>ele[0])//sortArr copy
      for(let i = Object.keys(team).length; i < (peopleNum -9) /4 + 3; i += 1){
        team[i + 1] = []
      }//팀 만들기
      for(let i = 0; i < copySort.length; i += 1){
        const currentStudent = sortArr[0][0]
        let [cross ,teamFav, myFav, teamDiff] = new Array(4).fill(false)
        let makeHead = 0
        let crossTeam = 0
        let favTeam = 0
        for(let j = Math.max(...Object.keys(team)); j >= 1; j --){
          if(isCross(currentStudent,team[j][0]) || isCross(currentStudent,team[j][1]) || isCross(currentStudent,team[j][2]) ){
            if(team[j].length < 4){
               cross = true
              crossTeam = j
            }
          } // 현재수강생이 선호하는 사람이 팀에 있고 현재수강생을 선호할 경우
          else if(isTeamFav(team[j],currentStudent)){
            if(team[j].length < 4){
              favTeam = j
            teamFav = true
            }
          } //팀내에 현재수강생을 선호하는 사람이 있을 경우
          else if(team[j].includes(data[currentStudent].Favorite[0]) || team[j].includes(data[currentStudent].Favorite[1]) || team[j].includes(data[currentStudent].Favorite[2])){
            if(team[j].length < 4){
              favTeam = j
            myFav = true
            }
           
          } //현재 수강생이 선호하는 사람이 팀에 있을 경우
          else if(team[j].length === 0){
            makeHead = j
          }
        } // 팀을 순회해서 적합한 팀을 선택
        if(cross && !isTeamDiff(team[crossTeam],currentStudent)){ 
          team[crossTeam].push(currentStudent)
          assignedArr.push(currentStudent)
          
        }
        else if(teamFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else if(myFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else{
          if(makeHead !== 0){
            team[makeHead].push(currentStudent) 
            assignedArr.push(currentStudent)
          }
          else{
            for(let key in team){
              if(Number(key) <= (peopleNum -9)/ 4){
                if(team[key].length < 4 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                team[key].push(currentStudent)
                assignedArr.push(currentStudent)
              }
              }
              else{
               if(team[key].length < 3 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                 team[key].push(currentStudent)
                assignedArr.push(currentStudent)
               }
              }
              
            }
          }
        }
        sortArr.shift()
        
      }
    }
    else if(peopleNum % 4 === 2){
     console.log(`총 인원 : ${peopleNum}, 4명 팀 : ${parseInt((peopleNum-6) / 4)}, 3명 팀 : 2`)
      const assignedNum = Object.keys(team).length
      const copySort = sortArr.map((ele)=>ele[0])//sortArr copy
      for(let i = Object.keys(team).length; i < (peopleNum -6) /4 + 2; i += 1){
        team[i + 1] = []
      }//팀 만들기
      for(let i = 0; i < copySort.length; i += 1){
        const currentStudent = sortArr[0][0]
        let [cross ,teamFav, myFav, teamDiff] = new Array(4).fill(false)
        let makeHead = 0
        let crossTeam = 0
        let favTeam = 0
        for(let j = Math.max(...Object.keys(team)); j >= 1; j --){
          if(isCross(currentStudent,team[j][0]) || isCross(currentStudent,team[j][1]) || isCross(currentStudent,team[j][2]) ){
            if(team[j].length < 4){
               cross = true
              crossTeam = j
            }
          } // 현재수강생이 선호하는 사람이 팀에 있고 현재수강생을 선호할 경우
          else if(isTeamFav(team[j],currentStudent)){
            if(team[j].length < 4){
              favTeam = j
            teamFav = true
            }
          } //팀내에 현재수강생을 선호하는 사람이 있을 경우
          else if(team[j].includes(data[currentStudent].Favorite[0]) || team[j].includes(data[currentStudent].Favorite[1]) || team[j].includes(data[currentStudent].Favorite[2])){
            if(team[j].length < 4){
              favTeam = j
            myFav = true
            }
           
          } //현재 수강생이 선호하는 사람이 팀에 있을 경우
          else if(team[j].length === 0){
            makeHead = j
          }
        } // 팀을 순회해서 적합한 팀을 선택
        if(cross && !isTeamDiff(team[crossTeam],currentStudent) ){ 
          team[crossTeam].push(currentStudent)
          assignedArr.push(currentStudent)
          
        }
        else if(teamFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else if(myFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else{
          if(makeHead !== 0){
            team[makeHead].push(currentStudent) 
            assignedArr.push(currentStudent)
          }
          else{
            for(let key in team){
              if(Number(key) <= (peopleNum -6)/ 4){
                if(team[key].length < 4 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                team[key].push(currentStudent)
                assignedArr.push(currentStudent)
              }
              }
              else{
               if(team[key].length < 3 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                 team[key].push(currentStudent)
                assignedArr.push(currentStudent)
               }
              }
              
            }
          }
        }
        sortArr.shift()
        
      }
    }
    else if(peopleNum % 4 === 3){
      console.log(`총 인원 : ${peopleNum}, 4명 팀 : ${parseInt((peopleNum -3) / 4)}, 3명 팀 : 1`)
      const assignedNum = Object.keys(team).length
      const copySort = sortArr.map((ele)=>ele[0])//sortArr copy
      for(let i = Object.keys(team).length; i < peopleNum /4; i += 1){
        team[i + 1] = []
      }//팀 만들기
      for(let i = 0; i < copySort.length; i += 1){
        const currentStudent = sortArr[0][0]
        let [cross ,teamFav, myFav, teamDiff] = new Array(4).fill(false)
        let makeHead = 0
        let crossTeam = 0
        let favTeam = 0
        for(let j = Math.max(...Object.keys(team)); j >= 1; j --){
          if(isCross(currentStudent,team[j][0]) || isCross(currentStudent,team[j][1]) || isCross(currentStudent,team[j][2]) ){
            if(team[j].length < 4){
               cross = true
              crossTeam = j
            }
          } // 현재수강생이 선호하는 사람이 팀에 있고 현재수강생을 선호할 경우
          else if(isTeamFav(team[j],currentStudent)){
            if(team[j].length < 4){
              favTeam = j
            teamFav = true
            }
          } //팀내에 현재수강생을 선호하는 사람이 있을 경우
          else if(team[j].includes(data[currentStudent].Favorite[0]) || team[j].includes(data[currentStudent].Favorite[1]) || team[j].includes(data[currentStudent].Favorite[2])){
            if(team[j].length < 4){
              favTeam = j
            myFav = true
            }
           
          } //현재 수강생이 선호하는 사람이 팀에 있을 경우
          else if(team[j].length === 0){
            makeHead = j
          }
        } // 팀을 순회해서 적합한 팀을 선택
        if(cross && !isTeamDiff(team[crossTeam],currentStudent)){ 
          team[crossTeam].push(currentStudent)
          assignedArr.push(currentStudent)
          
        }
        else if(teamFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else if(myFav && !isTeamDiff(team[favTeam],currentStudent)){
          team[favTeam].push(currentStudent)
          assignedArr.push(currentStudent)
        }
        else{
          if(makeHead !== 0){
            team[makeHead].push(currentStudent) 
            assignedArr.push(currentStudent)
          }
          else{
            for(let key in team){
              if(team[key].length < 4 && !isTeamDiff(team[key],currentStudent) && !assignedArr.includes(currentStudent)){
                team[key].push(currentStudent)
                assignedArr.push(currentStudent)
              }
            }
          }
        }
        sortArr.shift()
        
      }
      
    }
    
    
    
  }
  
  makeTeam()
  console.log('----------------------------------------------팀 목록',team,'-------------------------------------------')
 
//   console.log(assignedArr,'--------------------확인용')
  

  
 
  
};
