import Controller from '@ember/controller';
import ActionMixin from '@identity-x/manage/mixins/action-mixin';
import OrgQueryMixin from '@identity-x/manage/mixins/org-query';
import gql from 'graphql-tag';
import { inject } from '@ember/service';

const mutation = gql`
  mutation OrgAppCreate($input: CreateApplicationMutationInput!) {
    createApplication(input: $input) {
      id
      name
      description
      loginLinkTemplate {
        subject
        unverifiedVerbiage
        verifiedVerbiage
        loginLinkStyle
        loginLinkText
      }
      language
    }
  }
`;

export default Controller.extend(ActionMixin, OrgQueryMixin, {
  errorNotifier: inject(),

  actions: {
    async create(closeModal) {
      try {
        this.startAction();
        const {
          name,
          description,
          loginLinkTemplate,
          email,
          language = 'en-us',
        } = this.get('model');
        const input = {
          name,
          description,
          loginLinkTemplate: this.formatLoginLinkTemplateInput(loginLinkTemplate),
          email,
          language,
        };
        const variables = { input };
        const refetchQueries = ['Org', 'OrgApps'];
        await this.mutate({ mutation, variables, refetchQueries }, 'createApplication');
        await closeModal();
      } catch (e) {
        this.errorNotifier.show(e)
      } finally {
        this.endAction();
      }
    },

    returnToAppList() {
      return this.transitionToRoute('manage.orgs.view.apps.list');
    },
  }
})
