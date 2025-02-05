const clientId = new URLSearchParams(window.location.search).get('client_id');
const apiUrl = 'YOUR_API_URL_HERE';

async function fetchActions() {
    const response = await fetch(`${apiUrl}?client_id=${clientId}`);
    const actions = await response.json();
    displayActions(actions);
}

function displayActions(actions) {
    const actionsList = document.getElementById('actions-list');
    actionsList.innerHTML = '';
    actions.forEach(action => {
        const actionBlock = document.createElement('div');
        actionBlock.className = 'action-block';
        
        const actionHeader = document.createElement('div');
        actionHeader.className = 'action-header';
        actionHeader.innerHTML = `<div>${action.title}</div><div class="action-type">${action.action_type}</div>`;
        
        const actionDescription = document.createElement('div');
        actionDescription.className = 'action-description';
        actionDescription.textContent = action.description;
        
        const actionFooter = document.createElement('div');
        actionFooter.className = 'action-footer';
        actionFooter.innerHTML = `<div>${new Date(action.action_date).toLocaleString()}</div><div>${action.performed_by}</div>`;
        
        actionBlock.appendChild(actionHeader);
        actionBlock.appendChild(actionDescription);
        actionBlock.appendChild(actionFooter);
        
        actionsList.appendChild(actionBlock);
    });
}

async function filterActions() {
    const actionType = document.getElementById('action-type-filter').value;
    const response = await fetch(`${apiUrl}?client_id=${clientId}`);
    let actions = await response.json();
    if (actionType) {
        actions = actions.filter(action => action.action_type === actionType);
    }
    displayActions(actions);
}

fetchActions();
