function openTab(evt) {  
  const tabName = evt.currentTarget.id;
  const tabs = document.querySelectorAll('.tab');

  for(let i=0; i<tabs.length; i++){
    if(tabs[i].id === tabName){
      tabs[i].classList.add('active');
    }else{
      tabs[i].classList.remove('active');
    }
  }
}

console.log('Dashboard Script Loaded!!')
document.querySelectorAll('.tab-button').forEach(tabButton => tabButton.addEventListener('click', openTab));
