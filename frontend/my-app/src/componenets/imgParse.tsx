const Parsepp = (pp: string) => {
    if (pp && pp.startsWith('localhost:3000/profile-pictures/'))
    pp = 'http://' + pp
    return pp
}

export default Parsepp