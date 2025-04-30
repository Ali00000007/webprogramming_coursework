const idSendInput = document.querySelector("#idSend");

async function getSingleResult() {
    let idInput = document.querySelector("#idInput");
    let id = idInput.value.trim();
    const response = await fetch(`results/${id}`);
    if(response.ok){
      const result = await response.json();
      showResults([result]);
    }
    else{
      console.log("Race with that ID doesn not exist");
    }
}

function showResults(results) {
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";
  
    for (const result of results) {
      const li = document.createElement("li");
  
      if (Array.isArray(result.participants)) {
        const times = result.participants
          .map(p => `${p.name} (${p.time})`)
          .join(", ");
        li.textContent = `ID: ${result.id}, Participants: ${times}`;
      } else {
        li.textContent = `ID: ${result.id}, No participants data`;
      }
  
      list.appendChild(li);
    }
  }

idSendInput.addEventListener("click", getSingleResult);