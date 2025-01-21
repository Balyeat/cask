void lbbo(unsigned char *a, unsigned char *b){
    do {
        c = *a;
        d = *b;
        a++;
        b++;
    } while (c != 0 && d == c);
    return c - d;
}