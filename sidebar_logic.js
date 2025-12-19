
// ============================================================
// SIDEBAR TOGGLE LOGIC
// ============================================================
window.toggleSidebar = function () {
    const sidebar = document.querySelector('.sidebar') || document.querySelector('.sidebar-section');
    const mainContent = document.querySelector('.left-content');
    const expandBtn = document.getElementById('expandSidebarBtn');
    const collapseBtn = document.querySelector('.btn-collapse-sidebar');

    if (!sidebar || !mainContent) return;

    // Toggle classes
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // Toggle Button Visibility
    const isCollapsed = sidebar.classList.contains('collapsed');

    if (expandBtn) expandBtn.style.display = isCollapsed ? 'block' : 'none';

    // Save State
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Load State on Page Load
function loadSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.querySelector('.sidebar') || document.querySelector('.sidebar-section');
        const mainContent = document.querySelector('.left-content');
        const expandBtn = document.getElementById('expandSidebarBtn');

        if (sidebar) sidebar.classList.add('collapsed');
        if (mainContent) mainContent.classList.add('expanded');
        if (expandBtn) expandBtn.style.display = 'block';
    }
}
loadSidebarState();
