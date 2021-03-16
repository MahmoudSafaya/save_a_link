
let text = document.querySelector('#title');
let url = document.querySelector('#link');
let subject = document.querySelector('#subject');
const submit = document.querySelector('#submit');
const section = document.querySelector('#links');
const empty_section = document.querySelector('#empty_section');

function checkForLinks() {
  if(localStorage.getItem('links')){
    if(JSON.parse(localStorage.getItem('links')).length > 0){
      empty_section.style.display = 'none';
    } else{
      empty_section.style.display = 'block';
    }
  } else{
    empty_section.style.display = 'block';
  }
}
checkForLinks();

const links = [];

submit.addEventListener('click', (e) => {
  e.preventDefault();
  if(text.value == '' || subject.value == '' || url.value == ''){
    alert('You must enter a VALUE in each INPUT');
  } else {
    let titleVal = text.value;
    titleVal = titleVal.toUpperCase();
    // define the subject value
    let subjectVal = subject.value;
    subjectVal = subjectVal.toLowerCase();
    let urlVal = url.value;
    let obj = {
      titleVal,
      subjectVal,
      urlVal
    }
    links.push(obj);
    let firstLetter = titleVal.slice(0, 1);
    const div = document.createElement('div');
    div.setAttribute('class', 'box');
    div.innerHTML = `<i class="fas fa-ellipsis-v" id="menu"></i>
    <div class="box_back">${titleVal}</div>
    <div class="box_link ${subjectVal}">${firstLetter}</div>
    <div class="menu_div" id="menu_div">
      <p id="edit">Edit</p>
      <p id="remove">Remove</p>
    </div>`;
    section.appendChild(div);

    if(localStorage.length > 0 && localStorage.getItem('links')) {
      const localData = JSON.parse(localStorage.getItem('links'));
      localData.push(obj);
      localStorage.setItem('links', JSON.stringify(localData));

    } else {
      localStorage.setItem('links', JSON.stringify(links));
    }
    text.value = '';
    subject.value = '';
    url.value = '';
    empty_section.style.display = 'none';
    goToLink();
    menuClick();
    deleteItem();
    editItem();
    window.location.reload();
  }
});


// get the data from local storage and add it as a links
function getData() {
  const storageItems = JSON.parse(localStorage.getItem('links'));
  if(localStorage.length > 0 && localStorage.getItem('links')) {
    for(let i=0; i<storageItems.length; i++){
      const div = document.createElement('div');
      let titleItem = storageItems[i].titleVal;
      let subjectItem = storageItems[i].subjectVal;
      let firstItemLetter = titleItem.slice(0, 1);
      div.setAttribute('class', 'box');
      div.innerHTML = `
      <div class="box_back">${titleItem}</div>
      <div class="box_link ${subjectItem}">${firstItemLetter}</div>
      <div class="menu_div" id="menu_div">
        <p id="edit">Edit</p>
        <p id="remove">Remove</p>
      </div><i class="fas fa-ellipsis-v" id="menu"></i>`;
      section.appendChild(div);
    }
  }
}
getData();


// click the letter to go to the link
function goToLink(){
  const letters = document.querySelectorAll('.box_link');
  letters.forEach(element => {
    const parent = element.previousElementSibling.textContent;
    element.addEventListener('click', () => {
      const storageItems = JSON.parse(localStorage.getItem('links'));
      if(localStorage.length > 0) {
        for(let i=0; i<storageItems.length; i++){
          if(parent == storageItems[i].titleVal) {
            window.open(storageItems[i].urlVal);
          }
        }
      }
    })
  })
}
goToLink();

// menu icon code
const menu = document.querySelectorAll('#menu');
const menu_div = document.querySelectorAll('#menu_div');
function menuClick() {
  for(let i=0; i<menu.length; i++){
    menu[i].addEventListener('click', () => {
      menu_div[i].classList.toggle('visible');
    })
  }
}
menuClick();

//delete item on click the delete btn
function deleteItem() {
  const deleteBtn = document.querySelectorAll('#remove');

  deleteBtn.forEach(element => {
    element.addEventListener('click', (e) => {

      const item = e.currentTarget.parentElement.parentElement;
      const p = item.firstElementChild.innerHTML;
      const linksData = JSON.parse(localStorage.getItem('links'));
      let index;
      for(let i=0; i<linksData.length; i++){
        if(linksData[i].titleVal === p) {
          index = i;
          console.log(index);
        }
      }
      if(index > -1) {linksData.splice(index, 1)}
      localStorage.setItem('links', JSON.stringify(linksData));
      item.remove();

      const checkin = setTimeout(checkForLinks, 500);
    });
  });
}
deleteItem();

// function fo the edit btn
const edit_overlay = document.querySelector('#edit_overlay');
let oldTitle;
function editItem() {
  const editBtn = document.querySelectorAll('#edit');
  editBtn.forEach(element => {
    element.addEventListener('click', (e) => {
      edit_overlay.style.display = 'flex';
      oldTitle = e.currentTarget.parentElement.parentElement.firstElementChild.innerHTML;
    })
  })
  // the cancel button
  const cancel = document.querySelector('#cancel');
  cancel.addEventListener('click', () =>{
    edit_overlay.style.display = 'none';
    for(let i=0; i<menu_div.length; i++){
        menu_div[i].classList.remove('visible');
    }
  })
}
editItem();


// the edit form and its submit button
let editTitle = document.querySelector('#edit_title');
let editUrl = document.querySelector('#edit_link');
let editSubject = document.querySelector('#edit_subject');
const editSubmit = document.querySelector('#edit_submit');

editSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  if(editTitle.value == '' || editSubject.value == '' || editUrl.value == ''){
    alert('You must enter a VALUE in each INPUT');
  } else {
    let titleVal = editTitle.value;
    titleVal = titleVal.toUpperCase();
    // define the subject value
    let subjectVal = editSubject.value;
    subjectVal = subjectVal.toLowerCase();
    let urlVal = editUrl.value;
    let obj = {
      titleVal,
      subjectVal,
      urlVal
    }

    let linksData = JSON.parse(localStorage.getItem('links'));
    console.log(linksData);
    let index;
    for(let i=0; i<linksData.length; i++){
      if(linksData[i].titleVal === oldTitle) {
        index = i;
        console.log(index);
      }
    }
    linksData[index] = obj;
    localStorage.setItem('links', JSON.stringify(linksData));

    editTitle.value = '';
    editSubject.value = '';
    editUrl.value = '';
    edit_overlay.style.display = 'none';
    window.location.reload();
  }
});
