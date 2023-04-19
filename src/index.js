import DemoComponent from './components/demo/DemoComponent';

const app = document.getElementById('app');
const demoComponent = new DemoComponent();

app.textContent = demoComponent.demoFn();
