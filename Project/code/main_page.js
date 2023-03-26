window.onload = function() {
    const menuButton = document.querySelector(".topbar .menu");
    menuButton.addEventListener('click', e => {
        const sidebar = document.querySelector('.sidebar');
        if(sidebar.classList.contains('sidebar-closed')) {
            sidebar.classList.remove('sidebar-closed');
            sidebar.classList.add('sidebar-open');
        } else {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
        }
    });
}
