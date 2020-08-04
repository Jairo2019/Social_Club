import { useState, useEffect } from 'react';


export default function useEsMobil() {
    const [esMobil, setEsMobil] = useState(null);

    useEffect( () => {
        const mql = window.matchMedia('(min-width: 360px)');

        mql.addListener(revisarSiEsMobil);

        function revisarSiEsMobil() {
            if(mql.matches) {
                setEsMobil(false);
            } else {
                setEsMobil(true);
            }
        }
        revisarSiEsMobil();

        return () => mql.removeListener(revisarSiEsMobil);
    }, []);

    return esMobil;
}

