<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="authed-page"> 
    <!-- wrapper because Vue templates want only one container per template. Empty style for now. -->
    <!-- Note, this logo and tagline should go into the main header, to be applied to all pages. I couldn't figure out how to get the image to resolve in Vue where the header is. Can we have header templates? -->
    <div class="level">
      <div class="level-item">
        <a href="/">
          <img 
          src="../assets/img/bi-logo.svg" 
          alt="Breeding Insight home" 
          width="232" 
        >
        </a>
      </div>
    </div>
    <div class="level tagline">
      <p class="is-marginless">Tagline goes here</p>
    </div>
    <h1 class="title">
      Breeding Insight Style Guide
    </h1>
    <p class="subtitle">
      Living documentation of best practices and style examples
    </p>
    <section class="section">
      <div class="columns">
        <div class="column">      
          <h2 class="title is-3">
            Typestyles
          </h2>
          <p>Note that using an element with <code>class="title"</code> and that same element with <code>class="subtitle"</code> produces different results.</p>
          <p>Example:</p>
          <h3 class="title">
            This is an h3 element with a class=title and default size
          </h3>
          <h3 class="subtitle">
            This is an h3 element with a class=subtitle and default size
          </h3>
          <p>Also note that the sizing of headers does not depend on the heading level of the element. Size is controlled by the <code>is-1</code>, <code>is-2</code>, <code>is-3</code> classes and so on. In this manner, the desired visual hierarchy can be achieved while maintaining a proper document hierarchy.</p>
          <div class="box has-background-warning">
            <p>Be forewarned: this ability to separate semantics from display properties can cause accessibility errors just as easily as supporting good accessibility practices.</p>
            <p>Vigilance is required.</p>
          </div>
          <h2 class="title is-3">
            Spacing
          </h2>
          <p>Note that Bulma does not come with many opinions on spacing for paragraphs or other text. Bottom margins have been applied as a custom rule to paragraphs, tables, lists, and blockquotes, and more overrides to Bulma's defaults may be required in the future.</p>
          <p><strong>If you are writing a typographic spacing rule, please try to give thought to being as general a rule as possible but not overly general.</strong> This is in keeping with CSS best practice to not require individual classes for every element, but to increase specificity only as the design exceptions may occur.</p>
          <p>More information on typestyles to come.</p>
        </div>
        <aside class="column">
          <div class="message is-info">
            <div class="message-body">
              <h3 class="is-size-5 has-text-weight-bold">
                This is a helpful information message.
              </h3>
              <p>Any content that is displayed by the browser should be defined by a <strong>semantic element</strong>&mdash;defining the hierarchy and context of the element in relation to the page.</p>
              <p>Note that for this message, styling is used to adjust size and weight without the use of <code>title</code> or <code>subtitle</code> classes. The reason for this is that the default Bulma message with header has a different look. In future commits, the message header will be overridden to look more like this one so that we can use the <code>message-header</code> class.</p>
            </div>
          </div>
          <div class="notification is-danger">
            <p>The difference between this error notification and the above help message is the use of Bulma's Notification and Message elements, respectively.</p>
            <p>Also note that the color for this class is <code>is-danger</code>. At least one person (Liz) keeps trying to use <code>is-error</code> instead of <code>is-danger</code> for this color and may alias the latter to the former if habits are hard to break.</p>
          </div>
          <div class="box">
            <p>This is content set apart from other content with the Box component. It will be used to highlight a particular area, or set content apart. Likely this will be in conjunction with a semantic <code>&lt;section&gt;</code> or <code>&lt;aside&gt;</code> element.</p>
            <h2>
              Resources
            </h2>
            <p><a href="https://html.com/semantic-markup/">Semantic markup</a></p>
            <p><a href="https://bulma.io/documentation/">Bulma documentation</a></p>
          </div>
        </aside>
      </div>
    </section>
    <section class="section">
      <h2 class="title is-3">
        Forms and buttons
      </h2>
      <div class="columns">
        <div class="column is-two-thirds-desktop is-half-tablet">
                <form>
        <div class="field">
          <label class="label" for="breedername">Name</label>
          <div class="control">
            <input 
              class="input" 
              type="text" 
              placeholder="Text input"
              id="breedername"
            >
          </div>
        </div>

        <div class="field">
          <label class="label" for="useremail">Email</label>
          <p class="help is-danger">
            This email is invalid
          </p>
          <div class="control">
            <input 
              class="input is-danger" 
              type="email" 
              placeholder="Email input" 
              id="useremail"
              value="hello@"
            >
          </div>
        </div>

        <div class="field">
          <label class="label" for="subject">Subject</label>
          <div class="control">
            <div class="select">
              <select id="subject">
                <option value="select dropdowns">Select dropdown</option>
                <option value="with options">With options</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for="message">Message</label>
          <div class="control">
            <textarea
              class="textarea" 
              placeholder="Textarea"
              id="message"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox" for="terms">
              <input 
                type="checkbox"
                id="terms"
              >
              I agree to the <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary" value="submit">
              Submit
            </button>
          </div>
          <div class="control">
            <button class="button is-link is-light" value="cancel">
              Cancel
            </button>
          </div>
        </div>

      </form>
        </div>
        <div class="column">
          <p>It is highly recommended to refer to the Bulma documentation on proper code structure for form elements. Most operate in the same way, with a few exceptions (notably, <code>select</code>). Note that forms will expand to fill their container unless styled otherwise. Best practice might be to put a form into a <code>column</code> or <code>box</code> if a smaller width is specified.</p>
          <p>Button rollover state colors will be covered in a future card to make them more contrasting (and thus more accessible and usable).</p>
        </div>
      </div>
    </section>
      
    <section class="section">
      <h2 class="title is-3">
        Content and writing style
      </h2>
      <p>Here is where we will document our conventions for headline case vs sentence case in headers, bullet lists, tone, and other potentially contentious or overlooked writing style details.</p>
      <ul>
        <li>List here</li>
      </ul>
    </section>
  </div>
</template>