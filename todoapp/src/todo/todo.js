import React, { Component } from 'react';
import '../App.css';
import swal from 'sweetalert';
import { fire, db, auth} from './fire'

class todo extends Component {

 constructor() {
    super();
    this.state = {
      addTask:false,
      editTask:false,
      islogin:false,


      email:'',
      password:'',
      task:'',
      uptask:'',
      id:'',
      tasklist:[], 
    };


   
    
   //return views

   //this.SaveData = this.SaveData.bind(this);

   this.addObject = this.addObject.bind(this);
   this.changeCurrenttask = this.changeCurrenttask.bind(this);
   this.changeCurrentuptask = this.changeCurrentuptask.bind(this);
   this.canceleditTask = this.canceleditTask.bind(this);
   this.getDataFromFirebase = this.getDataFromFirebase.bind(this);


   
   this.getDataFromFirestore = this.getDataFromFirestore.bind(this);
   this.signUpfirebase = this.signUpfirebase.bind(this);
   this.Loginfirebase = this.Loginfirebase.bind(this);
   this.handleChangeEmail = this.handleChangeEmail.bind(this);
   this.handleChangePassword = this.handleChangePassword.bind(this);
   this.GetUserId = this.GetUserId.bind(this);
  }

  componentWillMount() {
    
    if (localStorage.getItem("userid") !== null) {
      this.setState({ islogin: true });
    } 

    //this.getDataFromFirebase();
    this.getDataFromFirestore();
  }



  GetUserId() {

    if (localStorage.getItem("userid") === null) {
    return '';
  } else {
      return localStorage.getItem("userid");
  }

}


  Loginfirebase(email, password) {
  
  auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
      localStorage.setItem("userid", res.user.uid);
      localStorage.setItem("useremail", email);
      
      this.setState({ islogin: true });

      swal("Good job!", "Login Successfully", "success");
      

    })
    .catch((error) => {
      swal("Bad job!", error.message, "error");
    })

}


signUpfirebase(){

  const { email, password } = this.state;
  //console.log(email,password)
  auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {
      var CurrentuseR = res.user.uid;
      var currentdate = new Date();

      db.collection("tblusers").doc(res.user.uid).set({ email, password, currentdate})
        .then(() => {
          localStorage.setItem("userid", CurrentuseR);
          localStorage.setItem("useremail", email);
          this.setState({ islogin: true });

          this.Loginfirebase(email, password);
          
        }).catch((e) => {
          console.error("Unable to insert in Database");
        })
    }).catch((error) => {
      if (error.message == "The email address is already in use by another account.") {
        this.Loginfirebase(email, password);
      }else{
        swal("Bad job!", error.message, "error");
        console.log("-" + error.message + "-", "errMessage");
      }
      
    })


}

 getDataFromFirebase(){

   /* Create reference to messages in Firebase Database */
   let messagesRef = fire.database().ref('todotask').orderByKey().limitToLast(100);

   messagesRef.on('child_added', snapshot => {
     /* Update React state when message is added at Firebase Database */
     let message = { task: snapshot.val(), id: snapshot.key };
     //console.log("message***", message);
     this.setState({ tasklist: [message].concat(this.state.tasklist) });
   })


 }


 getDataFromFirestore() {

   const userid = this.GetUserId();
   db.collection("tbltask").where("userid", "==", userid).get()
    .then((query) => {
      query.forEach(((doc) => {
        let message = { task: doc.data().task, id: doc.id };
        this.setState({ tasklist: [message].concat(this.state.tasklist) });
        //console.log(doc.data().task);
      }))
    })


}


    changeCurrenttask(e) {
     this.setState({ task : e.target.value })
  }
  changeCurrentuptask(e) {
    const {uptask} = this.state;
    this.setState({ uptask : e.target.value })
 }


  handleChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }


  updateObject(e){

    const { tasklist, uptask, upid} = this.state;
    tasklist[e.target.value].task = uptask;
    this.setState({ 
      tasklist,
      addTask:false,
      editTask:false
    })

    console.log(upid);
    var updates = {};
    updates[upid] = uptask;

    db.collection("tbltask").doc(upid).update({ task: uptask });
    //fire.database().ref('todotask/').update(updates);
    //db.ref("-Users/-KUanJA9egwmPsJCxXpv").update({ displayName: "New trainer" });
    swal("Good job!", "Task has been updated", "success");
  }


changeeditTask(index, ids) {

  const { tasklist, uptask, upid} = this.state;

    this.setState({
       addTask:false,
       editTask:true,
      id: index,
      upid: ids, 
      uptask: tasklist[index].task,
      });
      
 

  }


  canceleditTask() {

        this.setState({
           addTask:false,
           editTask:false,
          });
         
    
      }

remove(index,id){

//fire.database().ref('todotask/' + id).remove();

  db.collection("tbltask").doc(id).delete().then(function () {
    swal("Good job!", "Task has been removed", "success");
  }).catch(function (error) {
    swal("Bad job!", "Error removing document:", "error");
    //console.error(" ", error);
  });

  const { tasklist } = this.state;
  tasklist.splice(index, 1);
  this.setState({
    tasklist
  })
  
}




addObject(){


  const { tasklist, task } = this.state;

  /* Send the message to Firebase Realtime Database */
  //fire.database().ref('todotask').push(task);

  if (task.length > 0) {
    
    var userid = this.GetUserId();

    /* Send the message to Firebase Firestore Database */
    db.collection("tbltask").add({ userid, task })
      .then((res) => {


        const obj = { task, id: res.id };
        tasklist.push(obj);
        this.setState({ addTask: false, tasklist });


        swal("Good job!", "Task has been created", "success");

      })
      .catch((error) => {
        //var errMessage = error.message;
        //console.log(errMessage);
        swal("Bad job!", error.message, "error");
      })


}
else{
    swal("Bad job!", "Task shoud not empty!!", "error");
}
  


//this.SaveData(tasklist);

  
}


// SaveData(data){

//   console.log(data);
//   var a = [];
//   a = localStorage.getItem('session');
//   if (a != ""){
//     JSON.parse(localStorage.getItem('session'));
//   }
//   if(a == null){
//     a = [];
//   } a.push(data);
//   localStorage.setItem('session', JSON.stringify(a));
  
// }




renderTable(){
  const {tasklist} = this.state;

  let wordrap = { "word-break" : "break-word"};
  //console.log("tasklist***",tasklist);
  return ( <div> 

   <div className="form-group">   
  <h1> Your Current Todo Task!! </h1>
  <button className="form-control btn-primary" onClick={() => this.setState({addTask:true,task:''})} >Add Task </button>

  </div>
  <br/>

  
   <table className="table table-bordered">
    <thead>
      <tr>
      <th>No</th>
        <th>Task List</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
        {tasklist.map((item, index) => {
          return <tr> <td>{(index + 1)}</td>  <td style={wordrap}>{item.task}</td> 
          <td>  <button className="form-control btn-warning" onClick={this.changeeditTask.bind(this,index, item.id)} >Edit</button> </td>
          <td>  <button className="form-control btn-danger" onClick={(this.remove.bind(this, index, item.id))}>Delete</button> </td>
      </tr> })}
      
    </tbody>
  </table>
  
  
  


   </div>
   )
  
}



renderEditTask(){

  let styles = {
    width: '100%',
  };

  return  ( <div><h1>Edit Task!!! </h1>

   


    <div className="form-group">
    <input type="text" value={this.state.uptask}  onChange={this.changeCurrentuptask} className="form-control"/>
    <input type="hidden"  className="form-control"/>
    </div>
  
    <div class="form-group"><div class="col-md-6">
      <button type="submit" value={this.state.id} onClick={this.updateObject.bind(this)} className="btn btn-success" style={styles}>Update</button>
</div></div>

    <div class="form-group"><div class="col-md-6">
      <button type="submit" onClick={this.canceleditTask} className="btn btn-danger" style={styles}>Cancel</button>
</div></div>



  </div>
  )
}


renderTask(){

  let styles = {
    width: '100%',
  };



  return  ( <div> <h1>Add New Task!!! </h1>

   


    <div className="form-group">
    <input type="text" onChange={this.changeCurrenttask} className="form-control"/>
    </div>
  
  
    <div class="form-group"><div class="col-md-6">
      <button type="submit" onClick={this.addObject} className="btn btn-primary" style={styles}>Create Task</button>
    </div></div>

    <div class="form-group"><div class="col-md-6">
      <button type="submit" onClick={this.canceleditTask} className="btn btn-danger" style={styles}>Cancel</button>
    </div></div>



  </div>
  )
}


  renderLogins() {




    return (<div> <h1>Login!!! </h1> <h6> if dont have account insert for signup!!! </h6>




      <div className="form-group">
      
        <div className="form-group">
          <label>Email Address :</label>
          <input type="text" onChange={this.handleChangeEmail} className="form-control" />
        </div>
        <div className="form-group">
          <label>Password :</label>
          <input type="password" onChange={this.handleChangePassword} className="form-control" />
        </div>
      </div>

      <button type="submit" onClick={this.signUpfirebase} className="btn btn-primary">Submit</button>




    </div>
    )
  }


render() {

  const { addTask, editTask, islogin} = this.state;

    return (

        <div>
           
        {islogin && !addTask && !editTask && this.renderTable()}
        {islogin && addTask && !editTask && this.renderTask()}
        {islogin && !addTask && editTask && this.renderEditTask()}
        {!islogin && !addTask && !editTask && this.renderLogins()}
        </div>
      
    );
  }
}

export default todo;
