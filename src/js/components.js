// Компоненты
window.componentRenderer = {
    render: (name, container, data) => {
        console.log(\`Рендер компонента: \${name}\`);
    }
};
console.log('✅ Components загружены');
