export default function Banner({ bannerStyle = '', bannerText = '' }) {
  return (
    <>
      <style jsx>
        {`
          .moi-banner {
            position: fixed;
            top: 2.25rem;
            z-index: 3;
            background-color: #fff;
          }
        `}
      </style>

      <div className={`1w-100 ${bannerStyle}`}>{bannerText}</div>
      <br />
    </>
  );
}
