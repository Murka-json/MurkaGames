module.exports = {
    format: (x) => {
        return String(Math.floor(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    toKformat: (number) => {
        let k = "";
            while(number >= 1000) {
                number /= 1000;
                k+= "к";
            }
            return String(number) + k;
    },

    text: (num) => {
        var n = num.toString();
        const regex = /(\d)\s+(?=\d)/g;
        const subst = `$1`;
        return n.replace(regex, subst);
    },

    time: (stamp) => {

        let s = stamp % 60;
        stamp = (stamp - s) / 60;

        let m = stamp % 60;
        stamp = (stamp - m) / 60;

        let h = (stamp) % 24;
        let d = (stamp - h) / 24;

        let text = ``;

        if (d > 0) text += Math.floor(d) + " д. ";
        if (h > 0) text += Math.floor(h) + " ч. ";
        if (m > 0) text += Math.floor(m) + " мин. ";
        if (s > 0) text += Math.floor(s) + " с.";

        return text;
    }
};