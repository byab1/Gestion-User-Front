
export default function useHelpers() {
    //Formatage de nombre
    const formatNumber = (value, decimals = 2, thousandsSeparator = ',') => {
        let result = parseFloat(value).toFixed(decimals).toString();
        if (thousandsSeparator) result = result.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        return result;
    };

    const formatDate = (dateString, format = 'long') => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return 'N/A'; // Ou retourner une chaîne vide '' selon vos besoins
        }

        const date = new Date(dateString);
        const options = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            },
            timeOnly: {
                hour: '2-digit',
                minute: '2-digit'
            }
        };

        try {
            return date.toLocaleDateString('fr-FR', options[format] || options.long);
        } catch (error) {
            console.error('Erreur de formatage de date:', error);
            return 'N/A';
        }
    };

    const formatdateToLocalString = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString();
    };

    // Mettre première lettre en Majuscule
    const first2UpperCase = (texte) => {
        let t = new Array();
        let j = 0;
        for (j; j < texte.length; j++) {
            if (j == 0) t[j] = texte.substr(j, 1).toUpperCase();
            else t[j] = texte.substr(j, 1).toLowerCase();
        }
        return t.join('');
    };

    return {
        formatNumber,
        formatDate,
        first2UpperCase,
        formatdateToLocalString
    };
}
