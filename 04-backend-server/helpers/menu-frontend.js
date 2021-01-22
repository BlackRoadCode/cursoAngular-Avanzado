
const getMenuFrontend = (role = 'USER_ROLE') => {

  const menu = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', url: '/' },
        { title: 'Progressbar', url: 'progress' },
        { title: 'Gráfico', url: 'chart' },
        { title: 'Promesas', url: 'promises' },
        { title: 'RxJS', url: 'rxjs' },
      ]
    },
    {
      title: 'Mantenimientos',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        // { title:'Usuarios', url: 'usuarios' },
        { title: 'Hospitales', url: 'hospitales' },
        { title: 'Médicos', url: 'medicos' },
      ]
    }
  ];

  if (role === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({ title: 'Usuarios', url: 'usuarios' });
  } 

  return menu;
}

module.exports = { getMenuFrontend }