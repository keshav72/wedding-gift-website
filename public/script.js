// localStorage structure: { events: { eventId: { coupleName, gifts, claimedGifts, groups } } }

function generateEventId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Homepage: Create Event
  document.getElementById('createEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventId = generateEventId();
    const coupleName = document.getElementById('coupleName').value;
    const weddingDate = document.getElementById('weddingDate').value;
    const gifts = Array.from(document.getElementsByClassName('gift-item')).map(gift => ({
      name: gift.querySelector('.giftName').value,
      desc: gift.querySelector('.giftDesc').value,
      isGroupGift: gift.querySelector('.isGroupGift').checked
    }));
  
    const eventData = {
      coupleName,
      weddingDate,
      gifts,
      claimedGifts: {},
      groups: {}
    };
  
    // Save to localStorage
    const events = JSON.parse(localStorage.getItem('events') || '{}');
    events[eventId] = eventData;
    localStorage.setItem('events', JSON.stringify(events));
  
    // Redirect to dashboard
    window.location.href = `dashboard.html?eventId=${eventId}`;
  });
  
  function addGiftField() {
    const giftDiv = document.createElement('div');
    giftDiv.className = 'gift-item';
    giftDiv.innerHTML = `
      <input type="text" placeholder="Gift Name" class="giftName" required>
      <input type="text" placeholder="Description" class="giftDesc">
      <label><input type="checkbox" class="isGroupGift"> Group Gift</label>
      <button type="button" onclick="removeGift(this)">Remove</button>
    `;
    document.getElementById('giftList').appendChild(giftDiv);
  }
  
  function removeGift(button) {
    button.parentElement.remove();
  }
  
  // Event Page: Load Event
  function loadEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('events') || '{}');
    const event = events[eventId];
    
    document.getElementById('eventCoupleName').textContent = event.coupleName;
    const giftList = document.getElementById('giftList');
    
    event.gifts.forEach((gift, index) => {
      const giftDiv = document.createElement('div');
      giftDiv.className = 'gift-item';
      giftDiv.innerHTML = `
        <h3>${gift.name}</h3>
        <p>${gift.desc}</p>
        ${gift.isGroupGift ? 
          `<button onclick="joinGroup('${eventId}', ${index})">Join Group</button>` :
          `<button onclick="claimGift('${eventId}', ${index})">Claim Gift</button>`}
      `;
      giftList.appendChild(giftDiv);
    });
  }
  
  function claimGift(eventId, giftIndex) {
    const events = JSON.parse(localStorage.getItem('events'));
    events[eventId].claimedGifts[giftIndex] = true;
    localStorage.setItem('events', JSON.stringify(events));
    alert('Gift claimed successfully!');
  }
  
  function joinGroup(eventId, giftIndex) {
    const groupName = prompt('Enter group name:');
    if (groupName) {
      const events = JSON.parse(localStorage.getItem('events'));
      if (!events[eventId].groups[giftIndex]) {
        events[eventId].groups[giftIndex] = [];
      }
      events[eventId].groups[giftIndex].push(groupName);
      localStorage.setItem('events', JSON.stringify(events));
      alert('Joined group!');
    }
  }
  
  // Dashboard: Load Data
  function loadDashboard(eventId) {
    const events = JSON.parse(localStorage.getItem('events') || '{}');
    const event = events[eventId];
    
    document.getElementById('eventDetails').innerHTML = `
      <h2>${event.coupleName}</h2>
      <p>Wedding Date: ${event.weddingDate}</p>
    `;
  
    const giftStatus = document.getElementById('giftStatus');
    event.gifts.forEach((gift, index) => {
      giftStatus.innerHTML += `
        <div class="gift-item">
          <h3>${gift.name}</h3>
          <p>${gift.desc}</p>
          <p>Status: ${event.claimedGifts[index] ? 'Claimed' : 'Available'}</p>
          ${gift.isGroupGift ? `<p>Groups: ${event.groups[index]?.join(', ') || 'None'}</p>` : ''}
        </div>
      `;
    });
  }