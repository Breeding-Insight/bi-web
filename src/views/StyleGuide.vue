<template>
  <section class="style-guide section">
  <!-- Note, this logo and tagline should go into the main header, to be applied to all pages. I couldn't figure out how to get the image to resolve in Vue where the header is. Can we have header templates? -->
    <div class="level">
        <div class="level-item">
            <img src="../assets/img/bi-logo.svg" alt="Breeding Insight Logo" width="232" role="logo" />
        </div>
    </div>
    <div class="level tagline">
        <p>Tagline goes here</p>
    </div>
    <h1 class="title">Breeding Insight Style Guide</h1>
    <div class="columns">
        <div class="column">
            <h2 class="subtitle">Living documentation of best practices and style examples</h2>
            <p>If the next element after a subtitle is a paragraph, proper spacing will occur.</p>
            <h2 class="title is-4">Typestyles</h2>
            <p>Note that using an element with <code>class="title"</code> and that same element with <code>class="subtitle"</code> produces different results.
            <p>Example:</p>
            <h3 class="title">This is an h3 element with a class=title</h3>
            <h3 class="subtitle">This is an h3 element with a class=subtitle</h3>
            <p>Also note that the sizing of headers does not depend on the heading level of the element. Size is controlled by the <code>is-1</code>, <code>is-2</code>, <code>is-3</code> classes and so on.</p>
            <p>I am not sure why there is not a bottom margin on a paragraph before a header. Will check on that.</p>
            <p>More information on typestyles to come.</p>
        </div>
        <aside class="column">
            <div class="message is-info">
                <div class="message-body">
                    <h3 class="is-size-5 has-text-weight-bold">This is a helpful information message.</h3>
                    <p>Any content that is displayed by the browser should be defined by a <strong>semantic element</strong>&mdash;defining the hierarchy and context of the element in relation to the page.</p>
                    <p>Note that for this message, styling is used to adjust size and weight without the use of <code>title</code> or <code>subtitle</code> classes. The reason for this is that the default Bulma message with header has a different look. In future commits, the message header will be overridden to look more like this one so that we can use the <code>message-header</code> class.</p>
                </div>
            </div>
            <div class="notification is-danger">
                <p>The difference between this error notification and the above help message is the use of Bulma's Notification and Message elements, respectively.</p>
                <p>Also note that the color for this class is <code>is-danger</code>. For some reason I want it to be <code>is-error</code> and may alias the latter to the former.</p>
            </div>
            <div class="box">
                <p>This is content set apart from other content with the Box component. It will be used to highlight a particular area, or set content apart. Likely this will be in conjunction with a semantic <code>&lt;section&gt;</code> or <code>&lt;aside&gt;</code> element.</p>
                <h2>Resources</h2>
                    <p><a href="https://html.com/semantic-markup/">Semantic markup</a></p>
                    <p><a href="https://bulma.io/documentation/">Bulma documentation</a></p>
            </div>
        </aside>
    </div>
  </section>

</template>