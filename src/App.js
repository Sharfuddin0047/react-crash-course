import './App.css';
import { ProductCard } from './components/ProductCard';
import { ProductList } from './components/ProductList';

function App() {
  const products = [{
    imageSrc: "images/iphone.png",
    title: "iphone 15 pro",
    specifications: ["A17 pro chip with 6 core-GPU", "3x or 5x Telephoto camera", "upto 29 hours video playback"],
    price: "999",

  },
  {
    imageSrc: "images/airpods.png",
    title: "Airpods pro 2",
    specifications: ["Noise cancellation", "Dust, sweat, and water resistant", "upto 6 hours listening"],
    price: "249",

  },
  {
    imageSrc: "images/apple-watch.png",
    title: "Apple watch 9",
    specifications: ["45mm or 41mm case size", "Always-on retina display", "upto 18 hours normal use"],
    price: "399",

  },
  ];

  function handlePurchase(product) {
    alert(`You have clicked on ${product.title} which cost $${product.price}`)
  }
  
  return (
    <div className="App">
      <ProductList>
        <ProductCard width="96px" height="96px" background="darkolivegreen" product={products[0]} onPurchas={handlePurchase} />
        <ProductCard width="64px" height="64px" product={products[1]} onPurchas={handlePurchase}/>
        <ProductCard width="128px" height="128px" background="peru" product={products[2]} onPurchas={handlePurchase}/>
      </ProductList>
    </div>
  );
}

export default App;
