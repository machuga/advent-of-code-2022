#lang racket

(define input (port->string
                (open-input-file "./sample-input.txt")))

(define parse-input
  (map (lambda (value)
         (map string->number (string-split value "\n")))
       (string-split input "\n\n")))


(define (sum l) (apply + l))

(apply max (map sum parse-input))
