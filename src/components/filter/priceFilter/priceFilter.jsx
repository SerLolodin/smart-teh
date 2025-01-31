import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { filterActions } from "../../../store/filter";

import style from "./priceFilter.module.scss";

export const PriceFilter = () => {
    const dispatch = useDispatch();

    const { minProductPrice, maxProductPrice } = useSelector((store) => store.products);
    const { minPrice: filterMinPrice, maxPrice: filterMaxPrice } = useSelector((store) => store.filter);

    const [minPriceValue, setMinPrice] = useState("");
    const [maxPriceValue, setMaxPrice] = useState("");

    const priceOnChange = (e, fildName) => {
        const cleanValue = e.target.value.replace(/[^0-9]/g,"");
        if (fildName === "minPrice") {
            setMinPrice(cleanValue);
        } else {
            setMaxPrice(cleanValue);
        }
    }

    const checkMinPrice = (priceValue, filterMaxPrice, productMinPrice, productMaxPrice, filterMinPrice) => {
        
        // check priceValue < filterMaxPrice
        function CheckPriceValueLessThenMaxPriceFilter(priceValue, filterMaxPrice) {
            return filterMaxPrice.length > 0 && +priceValue >= +filterMaxPrice ? `${+filterMaxPrice - 1}` : priceValue;
        }

        // check priceValue >= productMinPrice
        function CheckPriceValueNotLessThenProductMinPrice(priceValue, productMinPrice) {
            return +priceValue <= productMinPrice ? productMinPrice : priceValue;
        }

        // check priceValue <= productMaxPrice
        function CheckPriceValueLessThenProductMaxPrice(priceValue, productMaxPrice) {
            return +priceValue >= productMaxPrice ? productMaxPrice - 1 : priceValue;
        }

        if (priceValue.length < 1) {
            return
        }

        if (filterMinPrice && filterMinPrice === priceValue) {
            return priceValue
        }
        priceValue = CheckPriceValueLessThenMaxPriceFilter(priceValue, filterMaxPrice);
        priceValue = CheckPriceValueNotLessThenProductMinPrice(priceValue, productMinPrice);
        priceValue = CheckPriceValueLessThenProductMaxPrice(priceValue, productMaxPrice);

        return priceValue
    }

    const checkMaxPrice = (priceValue, filterMinPrice, productMinPrice, productMaxPrice, filterMaxPrice ) => {
        
        // check priceValue > filterMinPrice
        function CheckPriceValueMoreThenMinPriceFilter(priceValue, filterMinPrice) {
            return filterMinPrice.length > 0 && +priceValue <= +filterMinPrice ? `${+filterMinPrice + 1}` : priceValue;
        }

        // check priceValue <= productMaxPrice
        function CheckPriceValueNotMoreThenProductMaxPrice(priceValue, productMaxPrice) {
            return +priceValue >= productMaxPrice ? productMaxPrice : priceValue;
        }

        // check priceValue >= productMinPrice
        function CheckPriceValueMoreThenProductMinPrice(priceValue, productMinPrice) {
            return +priceValue <= productMinPrice ? productMinPrice + 1 : priceValue;
        }

        if (priceValue.length < 1) {
            return
        }
        
        if (filterMaxPrice && filterMaxPrice === priceValue) {
            return priceValue
        }
        priceValue = CheckPriceValueMoreThenMinPriceFilter(priceValue, filterMinPrice);
        priceValue = CheckPriceValueNotMoreThenProductMaxPrice(priceValue, productMaxPrice);
        priceValue = CheckPriceValueMoreThenProductMinPrice(priceValue, productMinPrice);

        return priceValue
    }

    const priceOnBlur = (fildName) => {
        if (fildName === "minPrice") {
            const cleanValue = checkMinPrice(minPriceValue, maxPriceValue, minProductPrice, maxProductPrice, filterMinPrice);
            if (cleanValue) {
                setMinPrice(cleanValue);
                dispatch(filterActions.setMinPrice(cleanValue));
            } else {
                dispatch(filterActions.setMinPrice(""));
            }
        } else {
            const cleanValue = checkMaxPrice(maxPriceValue, minPriceValue, minProductPrice, maxProductPrice, filterMaxPrice);
            if (cleanValue) {
                setMaxPrice(cleanValue);
                dispatch(filterActions.setMaxPrice(cleanValue));
            } else {
                dispatch(filterActions.setMaxPrice(""));
            }
        }
    }

    useEffect(() => {
        setMinPrice(filterMinPrice);
        setMaxPrice(filterMaxPrice);
    }, [filterMinPrice, filterMaxPrice])

    return (
        <div className={style["price-filter"]}>
            <input
                className={style["price-filter__input"]}
                type="text"
                placeholder={`от ${ minProductPrice }`}
                name="minPrice"
                onChange={ (e) => priceOnChange(e, "minPrice") }
                onBlur={ () => priceOnBlur("minPrice") }
                value={ minPriceValue }
            />
            <span/>
            <input
                className={style["price-filter__input"]}
                type="text"
                placeholder={`до ${ maxProductPrice }`}
                name="maxPrice"
                onChange={(e) => priceOnChange(e, "maxPrice")}
                onBlur={ () => priceOnBlur("maxPrice") }
                value={ maxPriceValue }
            />
        </div>
    )
}