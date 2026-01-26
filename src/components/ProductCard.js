import { useState } from "react";
import styles from "./ProductCard.module.css";

export function ProductCard({ product, background = "slategray", onPurchase, onFavourite, isFavorite}) {
    const [stockCount, setStockCount] = useState(product.stockCount);
    const [showMore, setShowMore] = useState(false);

    function handleClick() {
        setStockCount((prevStockCount) => prevStockCount-1);
        onPurchase(product);
    }

    function handleTwoClicks() {
        setStockCount((prevStockCount) => prevStockCount-1);
        setStockCount((prevStockCount) => prevStockCount-1);
        onPurchase(product);
    }

    return (
        <article className={styles.Container} style={{ background }}>
            <button 
            className={styles.Favourite} 
            onClick={() => onFavourite(product.id)}
            
            >
                {isFavorite ? "❤️" : "🤍"}
            </button>
            <h2>{product.title}</h2>
            <img
                src={product.imageSrc}
                alt={product.title}
                width={128}
                height={128}
            />
            <p>Specification:</p>
            <button onClick={()=>setShowMore(!showMore)}>{showMore ? "hide" : "show"}</button>
            {showMore && <ul className={styles.Specification}>
                {product.specification.map((spec, index) => (
                    <li key={index}>{spec}</li>
                ))}
            </ul>}
            <Status stockCount={stockCount} />
            {stockCount > 0 && (
                <>
                    <p>Price: ${product.price}</p>
                    <button onClick={handleClick}>Buy</button>
                </>
            )}
            {stockCount > 1 && <button onClick={handleTwoClicks}>Buy 2</button>}
        </article>
    );
}

function Status({ stockCount }) {
    const notAvailableTemplate = (
        <p className={styles.NotAvailableStatus}>Not available</p>
    );

    const availableTemplate = (
        <p className={styles.AvailableStatus}>{stockCount} items available</p>
    );

    return stockCount === 0 ? notAvailableTemplate : availableTemplate;
}