import Markdown from "react-markdown";
import styles from "./styles.module.scss";

export function PaymentMethods({ data }) {
  return (
    <section className={styles.paymentMethods}>
      <h2>Formas de pagamento</h2>

      <main>
        {data?.map((method) => (
          <div className={styles.paymentMethod}>
            {method.logo !== null && (
              <img src={method.logo.url} alt={method.name} />
            )}

            <strong>{method.name}</strong>
            <Markdown>{method.description}</Markdown>

            {method.embed !== null && (
              <div
                className={styles.embed}
                dangerouslySetInnerHTML={{ __html: method?.embed }}
              />
            )}
          </div>
        ))}
      </main>
    </section>
  );
}
