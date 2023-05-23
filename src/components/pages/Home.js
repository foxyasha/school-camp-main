import React, {Component} from 'react';
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <>
            <header>
                <div className={'header_logo'}>
                    <div >
                    </div>
                    <button className={'button drop-button'}>
                        Информация
                    </button>
                </div>
                <nav>
                    <Link to="/login">
                        <button className={'button'}>
                            Войти
                        </button>
                    </Link>
                    <Link to="/registration">
                        <button className={'button'}>
                            Зарегистрироваться
                        </button>
                    </Link>
                </nav>
            </header>
        </>

    );
}

export default Home;