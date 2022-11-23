import { render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { byRole, byTestId } from 'testing-library-selector';

import { selectors } from '@grafana/e2e-selectors/src';
import { config, setBackendSrv, setDataSourceSrv } from '@grafana/runtime';
import { backendSrv } from 'app/core/services/backend_srv';

import 'whatwg-fetch';
import { RulerGrafanaRuleDTO } from '../../../types/unified-alerting-dto';

import { CloneRuleEditor } from './CloneRuleEditor';
import { mockDataSource, MockDataSourceSrv, mockRulerGrafanaRule, mockStore } from './mocks';
import { mockSearchApiResponse } from './mocks/grafanaApi';
import { mockRulerRulesApiResponse } from './mocks/rulerApi';
import { RuleFormValues } from './types/rule-form';
import { Annotation } from './utils/constants';
import { getDefaultFormValues } from './utils/rule-form';

const server = setupServer();

beforeAll(() => {
  setBackendSrv(backendSrv);
  setDataSourceSrv(new MockDataSourceSrv({}));
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const ui = {
  inputs: {
    name: byRole('textbox', { name: /rule name name for the alert rule\./i }),
    folderContainer: byTestId(selectors.components.FolderPicker.containerV2),
    namespace: byTestId('namespace-picker'),
    group: byTestId('group-picker'),
    annotationValue: (idx: number) => byTestId(`annotation-value-${idx}`),
    labelValue: (idx: number) => byTestId(`label-value-${idx}`),
  },
};

function getProvidersWrapper() {
  return function Wrapper({ children }: React.PropsWithChildren<{}>) {
    const store = mockStore((store) => {
      store.unifiedAlerting.dataSources['grafana'] = {
        loading: false,
        dispatched: true,
        result: {
          id: 'grafana',
          name: 'grafana',
          rulerConfig: {
            dataSourceName: 'grafana',
            apiVersion: 'legacy',
          },
        },
      };
      store.unifiedAlerting.dataSources['my-prom-ds'] = {
        loading: false,
        dispatched: true,
        result: {
          id: 'my-prom-ds',
          name: 'my-prom-ds',
          rulerConfig: {
            dataSourceName: 'my-prom-ds',
            apiVersion: 'config',
          },
        },
      };
    });

    const formApi = useForm<RuleFormValues>({ defaultValues: getDefaultFormValues() });

    return (
      <MemoryRouter>
        <Provider store={store}>
          <FormProvider {...formApi}>{children}</FormProvider>
        </Provider>
      </MemoryRouter>
    );
  };
}

describe('CloneRuleEditor', function () {
  describe('Grafana-managed rules', function () {
    it('should populate form values from the existing alert rule', async function () {
      const originRule: RulerGrafanaRuleDTO = mockRulerGrafanaRule(
        {
          for: '1m',
          labels: { severity: 'critical', region: 'nasa' },
          annotations: { [Annotation.summary]: 'This is a very important alert rule' },
        },
        { uid: 'grafana-rule-1', title: 'First Grafana Rule', data: [] }
      );

      mockRulerRulesApiResponse(server, 'grafana', {
        'folder-one': [{ name: 'group1', interval: '20s', rules: [originRule] }],
      });

      mockSearchApiResponse(server, []);

      config.datasources = {
        'my-prom-ds': mockDataSource({ name: 'my-prom-ds', uid: 'my-prom-ds' }),
      };

      render(<CloneRuleEditor sourceRuleId={{ uid: 'grafana-rule-1', ruleSourceName: 'grafana' }} />, {
        wrapper: getProvidersWrapper(),
      });

      await waitFor(() => {
        expect(ui.inputs.name.get()).toHaveValue('First Grafana Rule (Copied)');
        expect(ui.inputs.folderContainer.get()).toHaveTextContent('folder-one');
        expect(ui.inputs.group.get()).toHaveTextContent('group1');
        expect(ui.inputs.labelValue(0).get()).toHaveTextContent('critical');
        expect(ui.inputs.labelValue(1).get()).toHaveTextContent('nasa');
        expect(ui.inputs.annotationValue(0).get()).toHaveTextContent('This is a very important alert rule');
      });
    });
  });
});
