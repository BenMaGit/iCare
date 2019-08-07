const NoteData = require('../models/record');


const addNote = async(req, res, next) => {
    console.log('addnote')
    let email = req.body.email;
    let name = req.body.name;
    let date = req.body.date;
    let note = req.body.note;
    let consultant = req.body.consultant;

    let department = req.body.department;
    let studentID = req.body.studentID;
    let age = req.body.age;
    let gender = req.body.gender;
    let topic = req.body.topic
    let mark = []; //沒人收藏mark是空陣列

    let day = new Date();
    let reviseTime = day.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});  //台灣時區的
    

    let userNote = await NoteData.findbyUserID(studentID);

    
    if(userNote){
        let notelist = userNote.notelist;
        let currentNoteIndex = notelist.length - 1;
        let currentDate = notelist[currentNoteIndex].date
        if(date === cruuentDate){     //如果在同一個時段送出筆記 則會呼叫修改API修改筆記 而不會新增一筆
            res.json({status: 200, msg: '同一時段修改筆記'})
            console.log(date+ "CCCCCCCCCCCCCCC"+currentDate);
            return;
        }

        //notelist = userNote.notelist;
        let newNote = {date: date, note: note,  consultant: consultant, reviseTime: reviseTime, topic: topic, mark: mark};
        notelist.push(newNote);
        
        await NoteData.updateNotelistbyUserID(studentID, notelist);
        console.log(reviseTime+"PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP"+userNote+"KKKKKKKKKKKKKK");

        res.json({status: 200, msg: '舊有個案新增個案紀錄'})
        
        return;
    }else{
        let noteData = new NoteData({
            name: name,
            email: email,
            notelist:[{date: date, note: note,  consultant: consultant, reviseTime: reviseTime, topic: topic, mark: mark}],
            department: department,
            studentID: studentID,
            age: age,
            gender: gender
        })
        
        noteData.save().then(()=>{
            res.json({status: 200, msg: '建立新個案紀錄'})
        })
        
    }

    
    
}

const getRecord = async(req, res, next) => {  //取得某學生的全部筆記
    console.log('getRecord')
    let studentID = req.body.studentID;
    let userNote = await NoteData.findbyUserID(studentID);
    if(!userNote || !studentID){
        res.json({stats: 404})
        return
    }
    res.json({status: 200 , msg: userNote})
    
}
const getALLRecord = async(req, res, next) => {   //取得全部筆記 顯示在統計table
    console.log('getALL Record')
    
    let allRecord = await NoteData.findAllRecord();
    console.log(allRecord+"RRRRRRRRRRR")
    res.json({status: 200 , msg: allRecord})
    
}

const getNote = async(req, res, next) => {  //取得某學生某日的筆記
    console.log('get Note')
    let studentID = req.body.studentID;
    let date = req.body.date;
    console.log(studentID)
 

    let userNote = await NoteData.findbyUserID(studentID);
    let notelist = userNote.notelist;
    for(let i = 0; i < notelist.length; i++){
        if(notelist[i].date === date){
            res.json({status: '取得資料', msg: notelist[i].note})
            console.log(notelist[i].note);
            return;
        }
    }
    
    res.json({status: 400, msg: '查無資訊'})
}

const getMarkNote = async(req, res, next) => {
    console.log('getMarkNote')
    let account = req.body.account;
    let topic = req.body.topic;
    console.log(account+"TTTTTTTTTTT:" +topic)

    let allRecord = await NoteData.findAllRecord();
    let list = [];

    for(let i = 0; i < allRecord.length; i++){
        let student = allRecord[i];
        let studentNotelist = student.notelist;
        let tmplist = []
        for(let j = 0; j <studentNotelist.length; j++){
            for(let k = 0; k<studentNotelist[j].mark.length; k++){
                if(studentNotelist[j].topic === topic && studentNotelist[j].mark[k].account == account ){
                    tmplist.push(studentNotelist[j])
                    //studentNotelist.splice(j, 1);
                }
            }
        }
        if(tmplist.length >= 1){
            student.notelist = tmplist;
            list.push(student)
        }
    }  
    if(list.length == 0){
        res.json({status:400, msg: list + "無資料"});
        console.log("AAAAAAAAAAAAAAAA:" +list)
        return;
    } 
    res.json({status:200, msg: list});
    console.log("BBBBBBBBBBBBB:" +list)
    
}

const mark = async(req, res, next) => {  //把某人某日期的筆記設定是否為收藏
    console.log('Mark a note')
    let account = req.body.account;
    let date = req.body.date;
    let studentID = req.body.studentID;
    let mark = req.body.mark;

    let note = await NoteData.findbyUserIDandDate(studentID, date);
    if(!note){
        res.json({status: 400, msg:"mark失敗(無此筆記)"});
        console.log("mark失敗(無此筆記) "+ studentID + date)
        return;
    }

    let marknote;
    if(mark == 1){
        marknote = await NoteData.pushMarkbyUserIDandDate(studentID, date,account)
    }else if(mark == 0){
        marknote = await NoteData.pullMarkbyUserIDandDate(studentID, date,account)
    }
    res.json({status: 200, msg:"mark狀態已改變"});
    console.log("mark狀態已改變: "+ marknote+date)
}

const reviseNote = async(req, res, next) => {
    console.log('note revision')
    let studentID = req.body.studentID;
    let date = req.body.date;
    let note = req.body.note;

    let day = new Date();
    let reviseTime = day.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});

    let userNote = await NoteData.findbyUserID(studentID);
    let notelist = userNote.notelist;
    console.log(reviseTime+"GGGGGGGGGGGGGGGGGG")
    for(let i = 0; i < notelist.length; i++){
        if(notelist[i].date === date){
            notelist[i].note = note;
            break;
        }
    }
    await NoteData.updateNotelistbyUserID(studentID, notelist);
    await NoteData.updateReviseTimebyUserID(studentID, reviseTime);

    userNote = await NoteData.findbyUserID(studentID);  //最後回傳全部資料
    res.json({status: 200 , msg: userNote})
   
}

module.exports = {
    addNote,
    getRecord,
    getNote,
    reviseNote,
    getALLRecord,
    mark,
    getMarkNote

}